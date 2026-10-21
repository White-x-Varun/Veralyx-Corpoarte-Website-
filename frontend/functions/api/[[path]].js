export async function onRequest(context) {
  return context.env.VERALYX_API.fetch(context.request);
}
