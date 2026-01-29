export async function onRequest({ request, env }) {
  // Garante que só POST é aceito
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Lê o token vindo do frontend
  const { token } = await request.json();

  // Monta payload para o Cloudflare
  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET);
  formData.append("response", token);

  // Valida no Turnstile
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await res.json();

  // Retorna para o frontend
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}
