from fastapi import Request

def get_remote_address(request: Request):
    return request.client.host
