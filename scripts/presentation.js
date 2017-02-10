$(function() {

function template_callback () {
  $('.oEmbed').each((i,el) => {
    const url = 'http://twitter.com' + $(el).data('path')
    if (url==='http://twitter.com') {
      $(el).addClass('error');
    } else {
        $.ajax({
          url: 'https://api.twitter.com/1/statuses/oembed.json?url='+url,
          dataType: 'jsonp',
          success: function (data) {
            $(el).html(data.html);
          },
          error: function (e) {
            console.log(e, e.getAllResponseHeaders())
            $(el).addClass('error');
            $(el).html('<blockquote>error connecting to twitter</blockquote>')
          } 
        });
    }
  })

  impress().init(); 
}

// template numbers in series
let series = [...Array(15)].map((x,i) => i)

const el = 'section.series > div[template-for]'
const template = $(el)

const forTemplate = $(el).attr('template-for').split(' in ', 2)
const item = forTemplate[0]

const promises = series.map((ele) => (
  $.ajax({
    url: `templates/ele${ele}.template.html`,
  }).then((data) => {
    console.log('Processing ele' + ele)

    const $copyEl = $(el).clone()
    const r = new RegExp('\\{\\{\\s*' + item + '\\s*\\}\\}', 'g')
    const html = $copyEl.html().replace(r, data)

    $(html).insertBefore('section.series')
  }, (e) => {
    console.error(e)
  })
))

Promise.series = (promiseArr) => {
  return Promise.reduce(promiseArr, async (values, promise) => {
    if(promise === undefined) {
      console.log('processing undefined promise', promiseArr) 
      return
    }
    console.log(promise.toString())
    return await promise().then((result) => {
      values.push(result);
      return values;
    });
  }, []);
};

Promise.series(promises).then(() => {
  $('section.series').detach()
  template_callback()
})

}) // jQ onReady IIFE
