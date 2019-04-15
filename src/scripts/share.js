/**
 * Share buttons manager
 */
(function () {
  var counters = {
    facebook: false,
    vkontakte: false,
    odnoklassniki: false
  };

  var actions = {
    vkontakte: 'https://vk.com/share.php?act=count&index=0&url=',
    facebook: 'https://graph.facebook.com/?callback=FB.Share&id=',
    odnoklassniki: 'https://connect.ok.ru/dk?st.cmd=extLike&ref='
  }


  /**
   * Create url
   */
  function makeUrl(network) {
    var canonical = document.querySelector('link[rel="canonical"]');

    if (canonical && canonical.href) {
      link = encodeURIComponent(canonical.href);
    } else {
      link = encodeURIComponent(window.location.href.replace(window.location.hash, ''));
    }

    if (network in actions) {
      return actions[network] + link;
    }
  }


  /**
   * Open share popup window
   */
  function openPopup(url, params) {
    var left = Math.round(screen.width / 2 - params.width / 2);
    var top = 0;

    if (screen.height > params.height) {
      top = Math.round(screen.height / 3 - params.height / 2);
    }

    return window.open(url, params.id, 'left=' + left + ',top=' + top + ',' +
      'width=' + params.width + ',height=' + params.height + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
  }


  /**
   * Get share counters
   */
  function getShares(network) {
    var script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = makeUrl(network);
    script.id = 'share-' + network;

    document.getElementsByTagName('head')[0].appendChild(script);

    return true;
  }


  /**
   * Define global object to get vk shares
   */
  window.VK = {
    Share: {
      count: function (id, count) {
        document.getElementById('share-vkontakte').outerHTML = '';

        if (typeof count === 'undefined' || !count) {
          return;
        }

        var links = document.querySelectorAll('.share--vkontakte');

        for (var i = 0; i < links.length; i++) {
          var child = document.createElement("span");
          child.className = 'share__count';
          child.innerHTML = count;

          links[i].appendChild(child);
        }
      }
    }
  }


  /**
   * Define global object to get fb shares
   */
  window.FB = {
    Share: function (data) {
      document.getElementById('share-facebook').outerHTML = '';

      if (typeof data.share === 'undefined' || !data.share.share_count) {
        return;
      }

      var links = document.querySelectorAll('.share--facebook');

      for (var i = 0; i < links.length; i++) {
        var child = document.createElement("span");
        child.className = 'share__count';
        child.innerHTML = data.share.share_count;

        links[i].appendChild(child);
      }
    }
  }


  /**
   * Define global object to get ok shares
   */
  window.ODKL = {
    updateCount: function (id, count) {
      document.getElementById('share-odnoklassniki').outerHTML = '';

      if (typeof count === 'undefined' || !count) {
        return;
      }

      var links = document.querySelectorAll('.share--odnoklassniki');

      for (var i = 0; i < links.length; i++) {
        var child = document.createElement("span");
        child.className = 'share__count';
        child.innerHTML = count;

        links[i].appendChild(child);
      }
    }
  }


  /**
   * Get all share buttons to add event and counter
   */
  var links = document.querySelectorAll('.share');

  if (links === null) {
    return false;
  }

  for (var i = 0; i < links.length; i++) {
    var network = links[i].dataset.label;

    links[i].addEventListener('click', function (e) {
      e.preventDefault();

      return openPopup(this.href, {
        width: 600,
        height: 400,
        id: this.dataset.label
      })
    });

    if (network in counters && counters[network] === false) {
      counters[network] = getShares(network);
    }
  }
})();