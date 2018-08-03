const parseGuardian = (response, responseNumber) => {
  const data = JSON.parse(response);
  let count = 0;
  const article = data.response.results.map((el) => {
    count += 1;
    if (count <= responseNumber) {
      return {
        heading: el.fields.headline,
        date: el.webPublicationDate.split('T')[0],
        img_url: el.fields.thumbnail,
        link_url: el.fields.shortUrl,
      };
    }
  });
  return { Guardian: article };
};

const parseNYTimes = (response, responseNumber) => {
  const data = JSON.parse(response);
  let count = 0;
  const article = data.response.docs.map((el) => {
    count += 1;
    if (count <= responseNumber) {
      let imageUrl;
      if (el.multimedia.length) {
        imageUrl = `https://www.nytimes.com/${el.multimedia[0].url}`;
      } else {
        imageUrl = 'https://placeimg.com/640/480/arch';
      }
      let date;
      if (el.pub_date) {
        date = el.pub_date.split('T')[0];
      } else {
        date = undefined;
      }
      return {
        heading: el.headline.main,
        date,
        img_url: imageUrl,
        link_url: el.web_url,
      };
    }
  });
  return { NYTimes: article };
};

module.exports = { parseGuardian, parseNYTimes };
