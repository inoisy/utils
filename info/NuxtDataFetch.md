# Получение данных(SSR)

Источник: https://nuxtjs.org/docs/features/data-fetching

В Nuxt два варианта для корректного получения данных с сервера (на страницах и layoute, помимо nuxtServerInit). Это fetch и asyncData. В компонентах есть только fetch.

https://nuxtjs.org/docs/components-glossary/fetch


В Nuxt технически возможно получать их в mounted, но хук mounted вызывается только на клиенте, следовательно этих данных не будет в ответе сервера при ssr.
Так что если есть требование по SEO, или оно в теории может появиться, следует получить данные либо в nuxtServerInit (общие данные которые загрузятся один раз при открытии сайта, например список категорий сайте, контент для хедера/футера итд.) либо в fetch/asyncData(не mounted/created).

Жизненный цикл Nuxt https://nuxtjs.org/docs/concepts/nuxt-lifecycle

<img src="https://nuxtjs.org/_nuxt/image/de48ca.svg" alt="drawing" width="100%"/>

## fetch(после версии 2.12):




```
// page.vue

async fetch() {
    // fetch должен мутировать данные страницы напрямую, и ничего не возвращать, либо диспатчить стор
    try {
        this.pageData = await this.$axios.$get(...)
        await this.$store.dispatch(...)
    } catch(e){
        // set status code on server, important for SEO
        if (process.server) {
            this.$nuxt.context.res.statusCode = 404
        }
        // throwing an error will set $fetchState.error
        throw new Error('Article not found')
    }
}
// fetchOnServer: false // при необходимости, мы можем получать вызывать fetch только на клиенте
```
Мы можем использовать fetch на страницах, layout'ах и компонентах,также вызывать как метод ```this.$fetch()```, для повторной загрузки данных, фильтрации, и пагинации, например. Подробнее в статье:

 https://nuxtjs.org/announcements/understanding-how-fetch-works-in-nuxt-2-12/

 Также прочтите статью Сергея Бедрицкого, чтобы увидеть новый fetch хук в действии, когда он показывает, как создать клон dev.to!

 https://nuxtjs.org/tutorials/build-dev-to-clone-with-nuxt-new-fetch/


 https://fadamakis.medium.com/nuxt-patterns-you-will-love-as-a-vue-js-developer-part-2-34a6500c9fac

 ## asyncData 
 ```
    data(){
        return {
            someOtherData: ...
        }
    },
    async asyncData({ params, $axios, $store, error }) {
        let pageData = {}
        try{
            // ждём результата ответа сервера(или получаем через $content/$apollo итд)
            pageData = await $axios.$get(...)

            // при работе с vuex
            // важно убедиться что в экшене выбрасывается ошибка
            // await $store.dispatch(...)
            // await $accessor.getPageData()
        } catch(e) {
            // важно вернуть ошибку для корректного кода ответа сервера на SSR
           return error({ 
               statusCode: 404,
               // message: "..."
           })
        }
  
        return { 
            // возвращает данные и merge'ит их с data важно что бы названия были уникальны.
          pageData
        }
    }
```