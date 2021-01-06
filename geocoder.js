 const url =
      `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=596d9454-c267-4bf3-a45d-6b89c4a383bd&geocode=` +
      encodeURIComponent("варшавское ш");
    const { data: coords } = await $axios.get(url);
    console.log(
      "🚀 ~ file: contacts.vue ~ line 74 ~ asyncData ~ coords",
      coords.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
    );
    return [
        coords.response.GeoObjectCollection.featureMember[0].GeoObject.Point
          .pos,
      ],
