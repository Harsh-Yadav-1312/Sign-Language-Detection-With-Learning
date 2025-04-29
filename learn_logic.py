import os
import numpy as np
import tensorflow as tf
from PIL import Image
import cv2
import random

TFLITE_PATH = os.path.join("models", "model_mobilenet_v2.tflite")
IMAGE_SIZE = (160, 160)
CLASS_NAMES = [
    "A", "B", "C", "D", "E",
    "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O",
    "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y",
    "Z", "del", "space",
]

TARGET_SCORE = 0.92
CONSECUTIVE_REQUIRED = 4


interpreter = tf.lite.Interpreter(model_path=TFLITE_PATH)
classify_lite = interpreter.get_signature_runner("serving_default")


def get_image_array(image_data):
    img_array = tf.keras.utils.img_to_array(image_data)
    return tf.expand_dims(img_array, 0)


def predict_letter(frame):
    x1, y1 = 100, 100
    x2, y2 = x1 + IMAGE_SIZE[0], y1 + IMAGE_SIZE[1]
    cropped = frame[y1:y2, x1:x2]
    image_data = Image.fromarray(cropped)
    image_array = get_image_array(image_data)

    predictions = classify_lite(input_2=image_array)["outputs"]
    predicted_char = CLASS_NAMES[np.argmax(predictions)]
    score = np.max(predictions)

    return predicted_char, score


def get_random_letter():
    return random.choice(CLASS_NAMES[:-2])  # exclude 'del' and 'space'
