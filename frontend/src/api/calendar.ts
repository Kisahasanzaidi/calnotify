import API from "./api.ts";

export const getUserCalendarRange = async (
  userId: string,
  start: string, 
  end: string    
) => {
  const response = await API.get(`/events/user/${userId}/calendar-range`, {
    params: { start, end },
  });
  return response.data;
};
