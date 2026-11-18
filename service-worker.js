const CACHE_NAME =
  "expense-tracker-v1";


const FILES_TO_CACHE = [
  "./",
  "./Index.html",
  "./Style.css",
  "./App.js",
  "./manifest.json"
];



self.addEventListener(
  "install",
  function (event) {

    event.waitUntil(

      caches.open(
        CACHE_NAME
      )
      .then(
        function (cache) {

          return cache.addAll(
            FILES_TO_CACHE
          );

        }
      )

    );


    self.skipWaiting();

  }
);



self.addEventListener(
  "activate",
  function (event) {

    event.waitUntil(

      caches.keys()
        .then(
          function (keys) {

            return Promise.all(

              keys
                .filter(
                  function (key) {

                    return (
                      key !==
                      CACHE_NAME
                    );

                  }
                )

                .map(
                  function (key) {

                    return caches.delete(
                      key
                    );

                  }
                )

            );

          }
        )

    );


    self.clients.claim();

  }
);



self.addEventListener(
  "fetch",
  function (event) {

    event.respondWith(

      caches.match(
        event.request
      )
      .then(
        function (response) {

          return (
            response ||
            fetch(
              event.request
            )
          );

        }
      )

    );

  }
);
