from smtplib import SMTP
from email import encoders
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart



SMTP_HOST = 'localhost'
SMTP_PORT = 1025
SENDER_EMAIL = 'fake@email.com'
SENDER_PASSWORD = 'fakepassword'


def send_message(to, subject, content_body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html'))
    client = SMTP(host = SMTP_HOST, port = SMTP_PORT)
    client.send_message(msg = msg)
    client.quit()



    
def send_report(to, subject, attachment_path):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    content_body = "Thank You for being a valuable customer to us. We have attached your monthly shopping report."
    msg.attach(MIMEText(content_body, 'html'))

    with open(attachment_path, 'rb') as attachment:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename= {attachment_path}')
        msg.attach(part)

    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()
    return "Email Sent Successfully"
