export const getCreatedAt = (id: string) =>
   new Date(parseInt(id.substring(0, 8), 16) * 1000);