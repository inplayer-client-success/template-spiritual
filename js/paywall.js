function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  var config = {
    packages: [
      "106108"
    ],
    item_id: getParameterByName('id'),
    service_url: "https://services.inplayer.com"
  }

  var paywall = new InplayerPaywall('cc0cb013-9b32-4e3d-a718-8f9b69d49908', [{
    id: getParameterByName('id')
  }]);

  $('#preview-item').html('<div id="inplayer-' + getParameterByName('id') + '" class="inplayer-paywall"></div>');


  $('.inplayer-paywall-logout').hide();

  paywall.on('authenticated', function () {
    $('.inplayer-paywall-login').parent().hide();
    $('.inplayer-paywall-logout').parent().show();
  });

  paywall.on('logout', function () {
    location.reload();
  });

  function createItemElement(assetId, assetPhoto, assetTitle, assetDesc) {
    var output =
      '<div class="package-item"><div class="content" style="background-image:url(' +
      assetPhoto +
      ')">';
    output +=
      '<a href="./item.html?id=' +
      assetId +
      '" class="overlay-link"></a></div><div class="item-label"><div class="name">';
    output += assetTitle;
    output += assetDesc;
    output += "</div>";
    output += "</div></div>";
    return output;
  }


  config.packages.forEach((package, i) => {
    $.get(config.service_url + "/items/packages/" + package, response => {
      // console.log(response.id)
      var packageTitle = response.title;

      $("#package-title-" + package).html(packageTitle);

      $.get(
        config.service_url + "/items/packages/" + package + "/items?limit=500",
        response => {
          console.log($('#package-title-' + package))

          var output = "";

          for (var i = 0; i < response.collection.length; i++) {
            var asset = response.collection[i];
            // var asset1 = asset.access_fees;

            var assetId = asset.id;
            var assetPhoto = asset.metahash.paywall_cover_photo;

            var assetDesc = asset.metahash.preview_description;
            // console.log(assetDesc);

            var assetTitle = asset.title;
            output += createItemElement(assetId, assetPhoto, assetTitle, assetDesc);
            document.getElementById(
              "package-items-" + package
            ).innerHTML = output;

            // console.log(config.packages.length);
            // console.log(response.collection.length);
          } // for


        }
      ); // get items
    }); // get packages
  }); //for each
