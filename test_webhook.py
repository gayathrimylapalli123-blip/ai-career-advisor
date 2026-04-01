import requests

url = "https://gayathri-mylapalli00.app.n8n.cloud/webhook/0b1bc108-5556-4188-bcae-6d7cd78be793"

data = {
 "q1":"python",
 "q2":"Beginner",
 "q3":"Yes",
 "q4":"Basic",
 "q5":"pytorch",
 "q6":"Yes",
 "q7":"pandas,numpy",
 "q8":"matplotlib",
 "q9":"aws",
 "q10":"Yes",
 "q11":"mysql",
 "q12":"html,css",
 "q13":"Git",
 "q14":"AI",
 "q15":"0"
}

response = requests.post(url, json=data)

print(response.text)