from groq import Groq

client = Groq(api_key="GROQ_API_KEY")

def generate_response(user_text, intent, entities, context):
    prompt = f"""
You are a business analytics voice assistant.

Use the data below to generate:
1. A clear answer
2. A short analysis
3. A practical suggestion

Do not ask questions.
Keep language simple and professional.

Dont give "**"

Data:
{context}

User query:
{user_text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content