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

const series = { series1:[0,1,2,3,4,5,6], series2:[7,8,9,10], series3:[11,12,13,14] }
Object.keys(series).forEach(s => {
  const template = $('#' + s).find('div[template-for]')
  const outer_last = template.length

  template.each((i, el) => {
    const parent = $(el).parent()
    const forTemplate = $(el).attr('template-for').split(' in ', 2)
    const item = forTemplate[0], 
          group = forTemplate[1]

    const inner_last = series[group].length

    const promises = series[group].map((ele) => (
      $.ajax({
        url: `templates/ele${ele}.template.html`,
      }).then((data) => {
        console.log('Processing ele' + ele)

        const $copyEl = $(el).clone()
        const r = new RegExp('\\{\\{\\s*' + item + '\\s*\\}\\}', 'g')
        const html = $copyEl.html().replace(r, data)

        $(html).insertBefore(parent)
      }, (e) => {
        console.error(e)
      })
    ))

    Promise.series = async (promiseArr) => {
      return await Promise.reduce(promiseArr, (values, promise) => {
        if(promise === undefined) {
          console.log('processing undefined promise') 
          return
        }
        console.log(promise.toString())
        return promise().then((result) => {
          values.push(result);
          return values;
        });
      }, []);
    };

    Promise.series(promises).then(() => {
      $(parent).detach()
      template_callback()
    })
  })
})

}) // jQ onReady IIFE
