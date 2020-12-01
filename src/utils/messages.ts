//NOTE: this function is responsible for generating message for user with date
export const generateMessage = (text: string) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};
//NOTE: this function is responsible for generating location message with date
export const generateLocationMessage = (url: string) => {
  return {
    url,
    createdAt: new Date().getTime(),
  };
};
