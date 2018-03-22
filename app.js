(function () {
  var app = {
    // routes (i.e. views and their functionality) defined here
    'routes': {
      'game': {
        'rendered': function () {
        }
      },
      'leaderboard': {
        'rendered': function () {
          let table = document.getElementsByTagName('tbody')[0]
          let rowCount = table.rows.length
          for (var i = rowCount; i > 0; i--) {
            table.deleteRow(i)
          }
          let scores = JSON.parse(localStorage.getItem('players'))
          let topScore = scores.sort((a, b) => a.score > b.score ? -1 : 1)

          for (let i = 0; i < (scores.length > 10 ? 10 : scores.length); i++) {
            table.innerHTML += '<tr><td>' + topScore[i].player + '</td><td>' +
              topScore[i].score + '</td></tr>'
          }
        }
      }
    },
    // The default view is recorded here. A more advanced implementation
    // might query the DOM to define it on the fly.
    'default': 'the-default-view',
    'routeChange': function () {
      app.routeID = location.hash.slice(1)
      app.route = app.routes[app.routeID]
      app.routeElem = document.getElementById(app.routeID)
      if (app.route) {
        app.route.rendered()
      }
    },
    // The function to start the app
    'init': function () {
      window.addEventListener('hashchange', function () {
        app.routeChange()
      })
      // If there is no hash in the URL, change the URL to
      // include the default view's hash.
      if (!window.location.hash) {
        window.location.hash = app.default
      } else {
        // Execute routeChange() for the first time
        app.routeChange()
      }
    }
  }
  window.app = app
})()

app.init()
