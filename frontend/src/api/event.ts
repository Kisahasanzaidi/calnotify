import API from "./api.ts";

export const createEvent = async(eventData) =>{
    const response = await API.post('/events/create', eventData);
    return response.data;
}
export const updateEvent = async (id: string, eventData: any) => {
  const response = await API.put(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  await API.delete(`/events/${id}`);
};
