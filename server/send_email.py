import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import os

def send_email(username, code, email):

    password = os.getenv("EMAIL_PASSWORD") # пароль
    # me = os.getenv('EMAIL') # отправитель
    me = 'reactaxios@yandex.ru'
    you = email # получатель

    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Код для завершения регистрации" # тема письма
    msg['From'] = me                   
    msg['To'] = you

    # code = code
    # username = 'biyrololo'

    # Create the body of the message (a plain-text and an HTML version).
    text = f"Ваш код для завершения регистрации: {code}"

    from parse_html import get_html

    html = get_html(code, username)

    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')

    msg.attach(part1)
    msg.attach(part2)

    server = smtplib.SMTP_SSL('smtp.yandex.com')
    server.set_debuglevel(1)
    server.ehlo(me)
    server.login(me, password)
    server.auth_plain()
    server.sendmail(me, you, msg.as_string())
    server.quit()

if __name__ == '__main__':
    send_email('biyrololo', 123, 'porkalox@gmail.com')