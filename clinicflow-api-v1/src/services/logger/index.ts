export default {
  info: (msg: any, ...props: any[]) => {
    console.log(msg, ...props);
  },
  warn: (msg: any, ...props: any[]) => {
    console.warn(msg, ...props);
  },
  error: (msg: any, ...props: any[]) => {
    console.error(msg, ...props);
  },
  debug: (msg: any, ...props: any[]) => {
    console.log(msg, ...props);
  },
};
