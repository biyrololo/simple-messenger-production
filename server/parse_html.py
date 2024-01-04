file_name = 'mail.html'

with open(file_name, mode='r', encoding='utf-8') as f:
    data = ''.join(f.readlines())
    print(data)

def get_html(code : str | int, name: str) -> str:
    return data.replace('{{code}}', str(code)).replace('{{name}}', name)