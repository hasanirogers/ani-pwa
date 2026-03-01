import { IQuote, IProfile } from "../../shared/interfaces";

export const fixtureUser: IProfile = {
  "id": 1,
  "documentId": "w6ib29qyx67t6f0wcvbmry9d",
  "display_name": "OgdoadPantheon",
  "email": "ogdoad.pantheon@gmail.com",
  "provider": "local",
  "confirmed": true,
  "blocked": false,
  "created_at": "2024-11-22T04:52:07.547Z",
  "updated_at": "2024-12-25T19:37:18.463Z",
  "published_at": "2024-12-23T23:17:55.982Z",
  "first_name": "Ogdoad",
  "last_name": "Pantheon",
  "bio": "Developer. Creator. Cat lover. INTP since 1985.",
  "following": [9],
  "role": {
      "id": 2,
      "documentId": "pnz9fuauotps5cw3696yhsbp",
      "name": "Public",
      "description": "Default role given to unauthenticated user.",
      "type": "public",
      "createdAt": "2024-11-21T05:26:08.174Z",
      "updatedAt": "2024-12-23T08:59:12.940Z",
      "publishedAt": "2024-11-21T05:26:08.174Z"
  },
  "books": [
      {
          "id": 4,
          "documentId": "eapzm9jl51jjyyc0elouuf0f",
          "createdAt": "2024-12-15T07:16:59.741Z",
          "updatedAt": "2024-12-15T07:16:59.741Z",
          "publishedAt": "2024-12-15T07:16:59.739Z",
          "title": "Christ in Egypt",
          "identifier": "Iaqe9CG_s6cC"
      },
      {
          "id": 8,
          "documentId": "supivey0cbfgnfg70qi50lp9",
          "createdAt": "2024-12-17T05:10:16.072Z",
          "updatedAt": "2024-12-17T05:10:16.072Z",
          "publishedAt": "2024-12-17T05:10:16.069Z",
          "title": "Jesus the Egyptian",
          "identifier": "11ZYtFzzy2AC"
      },
      {
          "id": 9,
          "documentId": "j3m5uj3nq0o9h9wlzhu7esrs",
          "createdAt": "2024-12-17T05:17:06.232Z",
          "updatedAt": "2024-12-17T05:17:06.232Z",
          "publishedAt": "2024-12-17T05:17:06.230Z",
          "title": "Jesus from Outer Space",
          "identifier": "3nv3DwAAQBAJ"
      },
      {
          "id": 10,
          "documentId": "hkfsgmk309w7k9s2vemfyv9x",
          "createdAt": "2024-12-23T08:59:34.901Z",
          "updatedAt": "2024-12-23T08:59:34.901Z",
          "publishedAt": "2024-12-23T08:59:34.899Z",
          "title": "Destruction of Black Civilization",
          "identifier": "6UEztQEACAAJ"
      },
      {
          "id": 14,
          "documentId": "f9kiqmbekazw9qn9wwue13g8",
          "createdAt": "2024-12-25T19:20:35.494Z",
          "updatedAt": "2024-12-25T19:20:35.494Z",
          "publishedAt": "2024-12-25T19:20:35.491Z",
          "title": "The Ancient Egyptian Roots of Christianity",
          "identifier": "5PvI4IefhAoC"
      },
      {
          "id": 15,
          "documentId": "r9hc37v5vkr2pbq7znbocq01",
          "createdAt": "2024-12-25T19:20:56.038Z",
          "updatedAt": "2024-12-25T19:20:56.038Z",
          "publishedAt": "2024-12-25T19:20:56.037Z",
          "title": "Pagan Origins of the Christ Myth",
          "identifier": "zN1UEAAAQBAJ"
      },
      {
          "id": 13,
          "documentId": "rwna6qbk8vtptco7h0fiqrlu",
          "createdAt": "2024-12-25T19:20:01.251Z",
          "updatedAt": "2024-12-25T19:20:01.251Z",
          "publishedAt": "2024-12-25T19:20:01.249Z",
          "title": "Isis in the Ancient World",
          "identifier": "WpOTnGH6X9wC"
      },
      {
          "id": 12,
          "documentId": "fbo7v4smrm4qgopmvli5p4xs",
          "createdAt": "2024-12-25T19:19:48.636Z",
          "updatedAt": "2024-12-25T19:19:48.636Z",
          "publishedAt": "2024-12-25T19:19:48.634Z",
          "title": "The Secret Lore of Egypt",
          "identifier": "SB_y56Vlz5kC"
      }
  ],
  "avatar": {
      "id": 53,
      "documentId": "uep4c08uglufkwuipf81y3zn",
      "name": "mqdefault.jpg",
      "alternativeText": null,
      "caption": null,
      "width": 320,
      "height": 180,
      "formats": {
          "thumbnail": {
              "name": "thumbnail_mqdefault.jpg",
              "hash": "thumbnail_mqdefault_3b36b2730f",
              "ext": ".jpg",
              "mime": "image/jpeg",
              "path": null,
              "width": 245,
              "height": 138,
              "size": 10.28,
              "sizeInBytes": 10284,
              "url": "/uploads/thumbnail_mqdefault_3b36b2730f.jpg"
          }
      },
      "hash": "mqdefault_3b36b2730f",
      "ext": ".jpg",
      "mime": "image/jpeg",
      "size": 13.13,
      "url": "/uploads/mqdefault_3b36b2730f.jpg",
      "previewUrl": null,
      "provider": "local",
      "provider_metadata": null,
      "createdAt": "2024-11-30T04:07:12.695Z",
      "updatedAt": "2024-11-30T04:07:12.695Z",
      "publishedAt": "2024-11-30T04:07:12.695Z"
  }
};

export const fixtureQuotes: IQuote[] = [
  {
    "id": 48,
    "documentId": "enakof8wjf8l8pczzmkukfmo",
    "quote": "In the representation of the Zodiac in the Temple of Denderah (in Egypt) the figure of Virgo is annotated by a smaller figure of Isis with Horus in her arms; and the Roman Church fixed the celebration of Mary’s assumption into the glory at the very date ",
    "likes": [],
    "created_at": "2024-12-25T19:24:22.468Z",
    "updatedAt": "2024-12-25T19:24:22.468Z",
    "publishedAt": "2024-12-25T19:24:22.465Z",
    "page": "14",
    "note": "The Egyptians associated Isis and Horus with Virgo, the virgin. And the Romans knew this.",
    "private": false,
    "requotes": [],
    "requote": "",
    "user": {
      "id": 1,
      "documentId": "w6ib29qyx67t6f0wcvbmry9d",
      "display_name": "OgdoadPantheon",
      "email": "ogdoad.pantheon@gmail.com",
      "provider": "local",
      "confirmed": true,
      "blocked": false,
      "created_at": "2024-11-22T04:52:07.547Z",
      "updated_at": "2024-12-25T19:37:18.463Z",
      "published_at": "2024-12-23T23:17:55.982Z",
      "first_name": "Ogdoad",
      "last_name": "Pantheon",
      "bio": "Developer. Creator. Cat lover. INTP since 1985.",
      "following": [
        9
      ],
      "avatar": {
        "id": 53,
        "documentId": "uep4c08uglufkwuipf81y3zn",
        "name": "mqdefault.jpg",
        "alternativeText": null,
        "caption": null,
        "width": 320,
        "height": 180,
        "formats": {
          "thumbnail": {
            "name": "thumbnail_mqdefault.jpg",
            "hash": "thumbnail_mqdefault_3b36b2730f",
            "ext": ".jpg",
            "mime": "image/jpeg",
            "path": null,
            "width": 245,
            "height": 138,
            "size": 10.28,
            "sizeInBytes": 10284,
            "url": "/uploads/thumbnail_mqdefault_3b36b2730f.jpg"
          }
        },
        "hash": "mqdefault_3b36b2730f",
        "ext": ".jpg",
        "mime": "image/jpeg",
        "size": 13.13,
        "url": "/uploads/mqdefault_3b36b2730f.jpg",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2024-11-30T04:07:12.695Z",
        "updatedAt": "2024-11-30T04:07:12.695Z",
        "publishedAt": "2024-11-30T04:07:12.695Z"
      }
    },
    "book": {
      "id": 15,
      "documentId": "r9hc37v5vkr2pbq7znbocq01",
      "createdAt": "2024-12-25T19:20:56.038Z",
      "updatedAt": "2024-12-25T19:20:56.038Z",
      "publishedAt": "2024-12-25T19:20:56.037Z",
      "title": "Pagan Origins of the Christ Myth",
      "identifier": "zN1UEAAAQBAJ"
    },
    // comments: undefined,
    // author: undefined
  },
  {
    "id": 49,
    "documentId": "ezcnsq953l28gubb935r2r5w",
    "quote": "Drawing Ausar’s essence from him, she conceived a child Heru. In other words, Auset was impregnated by the holy ghost of Ausar.",
    "likes": [],
    "created_at": "2024-12-25T19:29:55.501Z",
    "updatedAt": "2024-12-25T19:29:55.501Z",
    "publishedAt": "2024-12-25T19:29:55.498Z",
    "page": "106",
    "note": "Auset is impregnated by the “Holy Ghost of Ausar.” The Egyptian word used is “spdt” (effectiveness), as opposed to “mtwt” (semen).",
    "private": false,
    "requotes": [],
    "requote": "",
    "user": {
      "id": 1,
      "documentId": "w6ib29qyx67t6f0wcvbmry9d",
      "display_name": "OgdoadPantheon",
      "email": "ogdoad.pantheon@gmail.com",
      "provider": "local",
      "confirmed": true,
      "blocked": false,
      "created_at": "2024-11-22T04:52:07.547Z",
      "updated_at": "2024-12-25T19:37:18.463Z",
      "published_at": "2024-12-23T23:17:55.982Z",
      "first_name": "Ogdoad",
      "last_name": "Pantheon",
      "bio": "Developer. Creator. Cat lover. INTP since 1985.",
      "following": [
        9
      ],
      "avatar": {
        "id": 53,
        "documentId": "uep4c08uglufkwuipf81y3zn",
        "name": "mqdefault.jpg",
        "alternativeText": null,
        "caption": null,
        "width": 320,
        "height": 180,
        "formats": {
          "thumbnail": {
            "name": "thumbnail_mqdefault.jpg",
            "hash": "thumbnail_mqdefault_3b36b2730f",
            "ext": ".jpg",
            "mime": "image/jpeg",
            "path": null,
            "width": 245,
            "height": 138,
            "size": 10.28,
            "sizeInBytes": 10284,
            "url": "/uploads/thumbnail_mqdefault_3b36b2730f.jpg"
          }
        },
        "hash": "mqdefault_3b36b2730f",
        "ext": ".jpg",
        "mime": "image/jpeg",
        "size": 13.13,
        "url": "/uploads/mqdefault_3b36b2730f.jpg",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2024-11-30T04:07:12.695Z",
        "updatedAt": "2024-11-30T04:07:12.695Z",
        "publishedAt": "2024-11-30T04:07:12.695Z"
      }
    },
    "book": {
      "id": 14,
      "documentId": "f9kiqmbekazw9qn9wwue13g8",
      "createdAt": "2024-12-25T19:20:35.494Z",
      "updatedAt": "2024-12-25T19:20:35.494Z",
      "publishedAt": "2024-12-25T19:20:35.491Z",
      "title": "The Ancient Egyptian Roots of Christianity",
      "identifier": "5PvI4IefhAoC"
    },
    // comments: undefined,
    // author: undefined
  },
  {
    "id": 50,
    "documentId": "ebh8ylzzy2fug5wp1rr2izaj",
    "quote": "... as a bird hovering over the king’s mummy, held in one hand the billowing sail, the hieroglyph for the wind or breath of life, and in the other the ankh. The resurrection of the dead Osiris was the result of Isis breathing into his nostrils the breath of life by flapping the air with her wings. ",
    "likes": [],
    "created_at": "2024-12-25T19:35:20.402Z",
    "updatedAt": "2024-12-25T19:35:20.402Z",
    "publishedAt": "2024-12-25T19:35:20.398Z",
    "page": "39",
    "note": "Isis magical wind power (breath of life) brings Osiris back as Horus.",
    "private": false,
    "requotes": [],
    "requote": "",
    "user": {
      "id": 1,
      "documentId": "w6ib29qyx67t6f0wcvbmry9d",
      "display_name": "OgdoadPantheon",
      "email": "ogdoad.pantheon@gmail.com",
      "provider": "local",
      "confirmed": true,
      "blocked": false,
      "created_at": "2024-11-22T04:52:07.547Z",
      "updated_at": "2024-12-25T19:37:18.463Z",
      "published_at": "2024-12-23T23:17:55.982Z",
      "first_name": "Ogdoad",
      "last_name": "Pantheon",
      "bio": "Developer. Creator. Cat lover. INTP since 1985.",
      "following": [
        9
      ],
      "avatar": {
        "id": 53,
        "documentId": "uep4c08uglufkwuipf81y3zn",
        "name": "mqdefault.jpg",
        "alternativeText": null,
        "caption": null,
        "width": 320,
        "height": 180,
        "formats": {
          "thumbnail": {
            "name": "thumbnail_mqdefault.jpg",
            "hash": "thumbnail_mqdefault_3b36b2730f",
            "ext": ".jpg",
            "mime": "image/jpeg",
            "path": null,
            "width": 245,
            "height": 138,
            "size": 10.28,
            "sizeInBytes": 10284,
            "url": "/uploads/thumbnail_mqdefault_3b36b2730f.jpg"
          }
        },
        "hash": "mqdefault_3b36b2730f",
        "ext": ".jpg",
        "mime": "image/jpeg",
        "size": 13.13,
        "url": "/uploads/mqdefault_3b36b2730f.jpg",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2024-11-30T04:07:12.695Z",
        "updatedAt": "2024-11-30T04:07:12.695Z",
        "publishedAt": "2024-11-30T04:07:12.695Z"
      }
    },
    "book": {
      "id": 13,
      "documentId": "rwna6qbk8vtptco7h0fiqrlu",
      "createdAt": "2024-12-25T19:20:01.251Z",
      "updatedAt": "2024-12-25T19:20:01.251Z",
      "publishedAt": "2024-12-25T19:20:01.249Z",
      "title": "Isis in the Ancient World",
      "identifier": "WpOTnGH6X9wC"
    },
    // comments: undefined,
    // author: undefined
  },
  {
    "id": 51,
    "documentId": "qaxdbwebk53vwdywz380v6if",
    "quote": "Devotion to the folk god Bes was especially tenacious. Amulets bearing his image have been found in Christian graves, and Bes and Christ are equated in a Coptic magical papyrus.",
    "likes": [],
    "created_at": "2024-12-25T19:38:10.687Z",
    "updatedAt": "2024-12-25T19:38:10.687Z",
    "publishedAt": "2024-12-25T19:38:10.685Z",
    "page": "75",
    "note": "Egyptian Bes is equated with Christ",
    "private": false,
    "requotes": [],
    "requote": "",
    "user": {
      "id": 1,
      "documentId": "w6ib29qyx67t6f0wcvbmry9d",
      "display_name": "OgdoadPantheon",
      "email": "ogdoad.pantheon@gmail.com",
      "provider": "local",
      "confirmed": true,
      "blocked": false,
      "created_at": "2024-11-22T04:52:07.547Z",
      "updated_at": "2024-12-25T19:37:18.463Z",
      "published_at": "2024-12-23T23:17:55.982Z",
      "first_name": "Ogdoad",
      "last_name": "Pantheon",
      "bio": "Developer. Creator. Cat lover. INTP since 1985.",
      "following": [
        9
      ],
      "avatar": {
        "id": 53,
        "documentId": "uep4c08uglufkwuipf81y3zn",
        "name": "mqdefault.jpg",
        "alternativeText": null,
        "caption": null,
        "width": 320,
        "height": 180,
        "formats": {
          "thumbnail": {
            "name": "thumbnail_mqdefault.jpg",
            "hash": "thumbnail_mqdefault_3b36b2730f",
            "ext": ".jpg",
            "mime": "image/jpeg",
            "path": null,
            "width": 245,
            "height": 138,
            "size": 10.28,
            "sizeInBytes": 10284,
            "url": "/uploads/thumbnail_mqdefault_3b36b2730f.jpg"
          }
        },
        "hash": "mqdefault_3b36b2730f",
        "ext": ".jpg",
        "mime": "image/jpeg",
        "size": 13.13,
        "url": "/uploads/mqdefault_3b36b2730f.jpg",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2024-11-30T04:07:12.695Z",
        "updatedAt": "2024-11-30T04:07:12.695Z",
        "publishedAt": "2024-11-30T04:07:12.695Z"
      }
    },
    "book": {
      "id": 12,
      "documentId": "fbo7v4smrm4qgopmvli5p4xs",
      "createdAt": "2024-12-25T19:19:48.636Z",
      "updatedAt": "2024-12-25T19:19:48.636Z",
      "publishedAt": "2024-12-25T19:19:48.634Z",
      "title": "The Secret Lore of Egypt",
      "identifier": "SB_y56Vlz5kC"
    },
    // comments: undefined,
    // author: undefined
  },
  {
    "id": 52,
    "documentId": "m1w55l2slvm554fdne614tkl",
    "quote": "The miraculous birth of Jesus could be viewed as analogous to that of Hours, whom Isis conceived posthumously from Osiris, and Mary was closely connected with Isis by many other shared characteristics.",
    "likes": [],
    "created_at": "2024-12-25T19:40:25.533Z",
    "updatedAt": "2024-12-25T19:40:25.533Z",
    "publishedAt": "2024-12-25T19:40:25.530Z",
    "page": "75",
    "note": "Hornung sees the birth of Horus as analogous to Jesus.",
    "private": false,
    "requotes": [],
    "requote": "",
    "user": {
      "id": 1,
      "documentId": "w6ib29qyx67t6f0wcvbmry9d",
      "display_name": "OgdoadPantheon",
      "email": "ogdoad.pantheon@gmail.com",
      "provider": "local",
      "confirmed": true,
      "blocked": false,
      "created_at": "2024-11-22T04:52:07.547Z",
      "updated_at": "2024-12-25T19:37:18.463Z",
      "published_at": "2024-12-23T23:17:55.982Z",
      "first_name": "Ogdoad",
      "last_name": "Pantheon",
      "bio": "Developer. Creator. Cat lover. INTP since 1985.",
      "following": [
        9
      ],
      "avatar": {
        "id": 53,
        "documentId": "uep4c08uglufkwuipf81y3zn",
        "name": "mqdefault.jpg",
        "alternativeText": null,
        "caption": null,
        "width": 320,
        "height": 180,
        "formats": {
          "thumbnail": {
            "name": "thumbnail_mqdefault.jpg",
            "hash": "thumbnail_mqdefault_3b36b2730f",
            "ext": ".jpg",
            "mime": "image/jpeg",
            "path": null,
            "width": 245,
            "height": 138,
            "size": 10.28,
            "sizeInBytes": 10284,
            "url": "/uploads/thumbnail_mqdefault_3b36b2730f.jpg"
          }
        },
        "hash": "mqdefault_3b36b2730f",
        "ext": ".jpg",
        "mime": "image/jpeg",
        "size": 13.13,
        "url": "/uploads/mqdefault_3b36b2730f.jpg",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2024-11-30T04:07:12.695Z",
        "updatedAt": "2024-11-30T04:07:12.695Z",
        "publishedAt": "2024-11-30T04:07:12.695Z"
      }
    },
    "book": {
      "id": 12,
      "documentId": "fbo7v4smrm4qgopmvli5p4xs",
      "createdAt": "2024-12-25T19:19:48.636Z",
      "updatedAt": "2024-12-25T19:19:48.636Z",
      "publishedAt": "2024-12-25T19:19:48.634Z",
      "title": "The Secret Lore of Egypt",
      "identifier": "SB_y56Vlz5kC"
    },
    // comments: undefined,
    // author: undefined
  },
  {
    "id": 1,
    "documentId": "bgiv5hr1c9rddh3goblaghlk",
    "quote": "They believed that the soul revivified the body and that the full, embodied person retained their life. St. Augustine wrote: “The Egyptians alone believe in the resurrection, as they carefully preserve their bodies.”",
    "likes": [
      1,
      7,
      9
    ],
    "created_at": "2024-11-22T22:32:52.164Z",
    "updatedAt": "2024-12-18T03:50:56.476Z",
    "publishedAt": "2024-12-18T03:50:56.473Z",
    "page": "17",
    "note": "Egyptians believed in bodily resurection.",
    "private": false,
    "requotes": [
      9
    ],
    "requote": null,
    "user": {
      "id": 1,
      "documentId": "w6ib29qyx67t6f0wcvbmry9d",
      "display_name": "OgdoadPantheon",
      "email": "ogdoad.pantheon@gmail.com",
      "provider": "local",
      "confirmed": true,
      "blocked": false,
      "created_at": "2024-11-22T04:52:07.547Z",
      "updated_at": "2024-12-25T19:37:18.463Z",
      "published_at": "2024-12-23T23:17:55.982Z",
      "first_name": "Ogdoad",
      "last_name": "Pantheon",
      "bio": "Developer. Creator. Cat lover. INTP since 1985.",
      "following": [
        9
      ],
      "avatar": {
        "id": 53,
        "documentId": "uep4c08uglufkwuipf81y3zn",
        "name": "mqdefault.jpg",
        "alternativeText": null,
        "caption": null,
        "width": 320,
        "height": 180,
        "formats": {
          "thumbnail": {
            "name": "thumbnail_mqdefault.jpg",
            "hash": "thumbnail_mqdefault_3b36b2730f",
            "ext": ".jpg",
            "mime": "image/jpeg",
            "path": null,
            "width": 245,
            "height": 138,
            "size": 10.28,
            "sizeInBytes": 10284,
            "url": "/uploads/thumbnail_mqdefault_3b36b2730f.jpg"
          }
        },
        "hash": "mqdefault_3b36b2730f",
        "ext": ".jpg",
        "mime": "image/jpeg",
        "size": 13.13,
        "url": "/uploads/mqdefault_3b36b2730f.jpg",
        "previewUrl": null,
        "provider": "local",
        "provider_metadata": null,
        "createdAt": "2024-11-30T04:07:12.695Z",
        "updatedAt": "2024-11-30T04:07:12.695Z",
        "publishedAt": "2024-11-30T04:07:12.695Z"
      }
    },
    "book": {
      "id": 3,
      "documentId": "uruosk8nfwm5vfr75re1jgkd",
      "createdAt": "2024-11-22T22:37:22.103Z",
      "updatedAt": "2024-12-15T06:26:35.969Z",
      "publishedAt": "2024-12-15T06:26:35.963Z",
      "title": "Osiris Death and Afterlife of a God",
      "identifier": "BUEiI-VXwi4C"
    }
  }
];
