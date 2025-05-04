import cv2
import numpy as np
import tensorflow as tf
from PIL import Image
import os

# Path to the TFLite model
TFLITE_PATH: str = os.path.join(os.path.dirname(os.path.realpath(__file__)), "models", "model_mobilenet_v2.tflite")

# Image size and class labels
IMAGE_SIZE: tuple[int, int] = (160, 160)
CLASS_NAMES: list[str] = [
    "A", "B", "C", "D", "E",
    "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O",
    "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y",
    "Z", "del", "space",
]

# Detection configuration
TARGET_FRAME_COUNT: int = 3
TARGET_CONSECUTIVE_PREDICTIONS: int = 4
TARGET_PREDICTION_SCORE: float = 0.92

# Load TFLite model once globally
interpreter = tf.lite.Interpreter(model_path=TFLITE_PATH)
interpreter.allocate_tensors()
classify_lite = interpreter.get_signature_runner("serving_default")

# Global state for persistent prediction
previous_predictions: dict[str, int] = {letter: 0 for letter in CLASS_NAMES}
text: str = ""


def get_image_array(image_data):
    img_array = tf.keras.utils.img_to_array(image_data)
    img_array = tf.expand_dims(img_array, 0)  # Add batch dimension
    return img_array


def predict(image_array):
    score_lite = classify_lite(input_2=image_array)["outputs"]
    predicted_char = CLASS_NAMES[np.argmax(score_lite)]
    prediction_score = np.max(score_lite)
    return predicted_char, prediction_score


def max_predicted(predictions: dict[str, int]) -> tuple[str, int]:
    return max(predictions.items(), key=lambda k: k[1])


def sign_detection(img):
    global previous_predictions, text

    # Flip for mirror-like effect
    img = cv2.flip(img, 1)

    # Crop ROI from the frame
    x1, y1 = 100, 100
    x2, y2 = x1 + IMAGE_SIZE[0], y1 + IMAGE_SIZE[1]
    img_cropped = img[y1:y2, x1:x2]

    # Preprocess
    image_data = Image.fromarray(img_cropped)
    image_array = get_image_array(image_data)

    # Predict
    predicted_char, prediction_score = predict(image_array)

    # Track consistent predictions
    if prediction_score >= TARGET_PREDICTION_SCORE:
        previous_predictions[predicted_char] += 1

    # Choose the most consistent prediction
    letter, count = max_predicted(previous_predictions)
    if count >= TARGET_CONSECUTIVE_PREDICTIONS:
        previous_predictions = {l: 0 for l in CLASS_NAMES}
        if letter == "space":
            text += " "
        elif letter == "del":
            text = text[:-1]
        else:
            text += letter

    # Annotate output
    cv2.putText(img, predicted_char.upper(), (5, 100), cv2.FONT_HERSHEY_SIMPLEX, 4, (255, 255, 255), 4)
    cv2.putText(img, f"(score = {prediction_score:.2f})", (50, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255))
    cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 0), 2)

    return img, predicted_char, str(prediction_score)
