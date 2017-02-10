$(function() {
/*  document.addEventListener('impress:stepenter', function (e) {
  switch (e.action) {
    case 'next':
    case 'prev':
      console.log(e.action)
      break
    case 'goto':
      console.log('going to ' + e.step)
  }
}, false); */

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
            console.log(e.getAllResponseHeaders())
            $(el).addClass('error');
            $(el).html('<blockquote>error connecting to twitter</blockquote>')
          } 
        });
    }
  })

  impress().init(); 
}

const series = { series1:[0,1,2,3,4,5,6], series2:[7,8,9,10], series3:[11,12,13,14] }

const outer_last = $('section.series').find('div[template-for]').length
$('section.series').find('div[template-for]').each((i, el) => {
  const parent = $(el).parent()
  const forTemplate = $(el).attr('template-for').split(' in ', 2)
  const item = forTemplate[0], 
        group = forTemplate[1]

  const inner_last = series[group].length

const promises = series[group].map((ele) => (
    $.ajax({
        url: `templates/ele${ele}.template.html`,
    }).then((data) => {
        const $copyEl = $(el).clone()
        const r = new RegExp('\\{\\{\\s*' + item + '\\s*\\}\\}', 'g')
        const html = $copyEl.html().replace(r, data)

        $(html).insertBefore(parent)
    }, (e) => {
        console.error(e)
    })
  ))

  Promise.all(promises).then(() => {
    $(parent).detach()
    template_callback()
  })
})

}) // jQ onReady IIFE
