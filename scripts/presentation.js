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
let series = [...Array(15)].map((x,i) => {
  $('section.series').after(`<div id="ele${14-i}">{{ ele }}</div>`)
  return i
})

const promises = series.map(i => (
  $.ajax({
    url: `templates/ele${i}.template.html`,
  }).then((data) => {
    console.log('Processing ele' + i)
    $('#ele'+i).replaceWith(data)
  }, (e) => {
    console.error(e)
  })
))

Promise.all(promises).then(() => {
  $('section.series').detach()
  template_callback()
})

}) // jQ onReady IIFE
