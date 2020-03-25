export const Unique = (subject: any[]): any[] => {
  const seen = {};
  return subject.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
};
