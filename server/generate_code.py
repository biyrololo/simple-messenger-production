def generate_code():

    import random
    import string

    numbers = string.digits
    code = ''.join(random.choice(numbers) for i in range(6))

    return code