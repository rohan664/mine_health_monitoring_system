'use server'

export const returnMessage = async (message: string,data:object={}) => {
    return {message:message,data:data};
}

interface apiRequestBodyType {
    method:string
    headers: HeadersInit,
    body?:string
}

export const fetchDetails = async (url:string,method:string,data:object={}) => {
    try {
        let apiRequestBody:apiRequestBodyType = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data)
        }
        if(method === "GET"){
            delete apiRequestBody.body;
        }
        const response = await fetch(url,apiRequestBody);
        const res = await response.json();
        return {
            data: res,
            status: response.status
        };
    }
    catch(err) {
        console.log(err);
        return {error:err};
    }
}