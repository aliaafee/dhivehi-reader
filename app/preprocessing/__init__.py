import re
from urllib import parse

from .num2words import num2words

time_re = re.compile(r"(0?[1-9]|1[0-2]):[0-5][0-9]") #match HH:MM 
number_re = re.compile(r"[+-]?([0-9]*[.])?[0-9]+")   #match all numbers including floats


def time2words(time_str):
    """
        Convert time in format HH:MM to words
    """
    parts = time_str.split(":")
    return num2words(parts[0], lang='dv', nominal=False) + " " + "ގަޑި" + " " + num2words(parts[1], lang='dv')


def all_numbers_to_words(text):
    """
        Convert all numbers in text to words.
        Issues: 
            - does not recognize dates, numbers with commas
            - does not address contextual nature of using special stems for counting
    """

    text = time_re.sub(lambda match: time2words(match.group()), text)

    text = number_re.sub(lambda match: num2words(match.group(), lang='dv'), text)

    return text

