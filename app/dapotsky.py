# function to compute the day you were born

def day_of_week(year, month, day):
    # Zeller's Congruence
    if month < 3:
        month += 12
        year -= 1
    K = year % 100
    J = year // 100
    h = (day + 13*(month + 1)//5 + K + K//4 + J//4 + 5*J) % 7
    return h


# function that translates formal english into slang english

def slangify(text):
    # dictionary of formal to slang words
    slang_dict = {
        "hello": "yo",
        "goodbye": "peace out",
        "good morning": "sup",
        "good afternoon": "what's good",
        "good evening": "what's poppin",
        "good night": "nighty night",
        "how are you": "how you doin",
        "what is your name": "what's your name",
        "what is the time": "what time is it",
        "what is the date": "what day is it",
        "what is your age": "how old are you",
    }
    # return the slang word if it exists, otherwise return the original word
    return slang_dict.get(text, text)
