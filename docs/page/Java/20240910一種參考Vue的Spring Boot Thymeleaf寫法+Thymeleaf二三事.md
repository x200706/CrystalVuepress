# 20240910一種參考Vue的Spring Boot Thymeleaf寫法+Thymeleaf二三事
## 代碼

component/xxx.html

```html
<button type="button" th:attr="id=${tagId} onclick='doSomething(\'' + ${value} + '\')'">按鈕</button>

<!-- 必要之惡，不然就算主頁面其他部分有jquery，他也說undefined，跟載入順序可能有關 -->
<script src="http://code.jquery.com/jquery-你要的版本.min.js"></script> 
<script th:inline="javascript">
// 彈性傳遞HTML id參數 + JQuery取用範例
var tagId = /*[[${selectId}]]*/ 'default_id';
$("#" + tagId).val();
// 對了JS本身可以這樣傳入變數
$(`#${tagId}`).val();
  
// 使用傳遞參數執行js方法
function doSomething (value) {
  console.log(value); // test
}

// some init func...
// other func...
</script>
```

要用的地方

```html
//html
<div th:insert="~{/從WEB-INF算起的目錄/xxx不用寫.html}" th:with="value='test', tagId='test_id'"></div> 
```


### Murmur集

- 要`<script>`代碼一起帶入好像無法用fragment

- 以上這方法就是..亂寫也能過->實際上不強制\
大概只有一開始就這樣寫 整個專案才會整齊吧

- 更早先前的傻版本

    - 是想在目的頁面上帶一個傳入用的js變數\
讓內嵌的頁面組件可以吃到傳入值\
事後想想既然th有現成又相對簡短的傳入方式，就用現成的！

- 參考資料：[th:insert与th:replace（与th:include）的区别 \| Thymeleaf参考指南 (gitbook.io)](https://jack80342.gitbook.io/thymeleaf/i.-using-thymeleaf/8-mo-ban-she-ji/8.1-bao-han-mo-ban-pian-duan/difference-between-th-insert-and-th-replace-and-th-include) 

- AI不知道是不是唬爛 他說`th:insert`可以插入變數 經過一些嘗試後感覺也不是不無可能（尚未測試...）

- 坊間許多人以為`th:insert`一定要帶fragment片段或單一選擇器（參考資料） 其實可以塞一般HTML檔<-甚至上面加`<html xmlns:th="http://www.thymeleaf.org" xmlns:sec="http://www.thymeleaf.org/extras/spring-security">`也不會錯誤 不過意義不大 因為要嵌入的頁面就有了

- 關於那個JQuery undefined問題，畢竟咱們組件屬於頁面不速之客，一言不合就在中間插隊script

    - JQuery通常是在頁面底下..還沒載到這時候用以下方法根本沒用..

        - `$().ready`<!-- {"indent":3} -->

            - `$j = jQuery.noConflict()`

            - `(function (){})(jquery)`<-其實這是模組不該這麼用

            - `script`標籤打上`defer`

    - 所以才會出現上方那個硬要引入JQuery的作法......

## 後續組件debug+補充

- 你有所不知的前端—按鈕竟然預設行為按了會submit然後跳走...所以大部分情形要加`type="button"`

- th傳遞速成：`${}`模版傳遞變數 `~{}`引用模版 `@{}`主要針對path（Controller路由也行）

- 用`th:with`帶來的值可以用`${}`取得

    - 可以帶多個變數

        - 
          ```
          th:with="contract=${contractObject}, user=${userObject}" 
          ```

    - 那為啥有一堆複雜的版本QQ

        - `/*[[${value}]]*/` 用於JS CSS

            - 替換效果

                - 
                  ```html
                  //html
                  <script>
                    var data = /*[[${value}]]*/ 'default value';
                  </script>
                  <!-- 替換後 -->
                  <script>
                    var data = 123; // 'default value'不見了 神奇吧囧
                  </script>
                  ```

        - `[[${value}]]` 用於HTML

    - 比較煩的是有時候包含特殊字元（th是原封不動幫你渲染過去喔...），有時要再跳脫頁面才能正常運作

        - 前情提要：上方範例`+`號就是拼接的意思，理解這個就能拼出自己想要的東西了

        - 基於這個顧慮坊間誕生很多版本...

            - AI版 是想確保直傳遞後能能以用兩個`'`包起來的字串 但如果沒有傳遞成功為null，反而多出`\` 

                - 
                  ```
                  <button type="button" th:onclick="'doSomething(\'' + ${value} + '\')'" >按鈕</button>
                  ```

            - 堆疊溢出網友版 他的`${}`好前面@@<-可能是我`${}`只包住變數，前後加`'''`反而模版渲染故障，你把他想成${}都是Spring Boot的領域就是了

                - 
                  ```
                  th:attr="onclick=${'toggleContractLine('+ ''' + contract.id + ''' + ')'}"
                  ```

            - 後來我知道為甚麼網友要用這麼多單引號了\
像是我寫`th:attr="onclick='doSomething('+${value}+')'"`轉換後變成`doSomething(test)`\
...這是一個js變數啊啊 難怪一直噴undefined，\
如果想要字串請把它變成真正的字串~~`th:attr="onclick='doSomething(''' + ${value} + ''')'"`~~ 這樣寫會壞掉\
採用AI後才不會：`<button type="button" th:attr="onclick='doSomething(\'' + ${value} + '\')'">按鈕</button>`

                - 基於上點產生通用設計規則上的問題

                    - 感覺傳的地方盡量單純 組件內盡量完善就是了...但就會有很多奇怪寫法囉

- 也有`th:onclick`可以直接用 問題是我想做個通用的範例齁..`th:attr`不管`style disable`都能帶勒

- 原本`<div th:replace="~{/從WEB-INF算起的目錄/xxx不用寫.html}" th:with="value='test'"></div>`這樣寫是錯的 整組被替換誰理你`th:with`@@\
但用`th:insert`又有div，真難~_~（官方已不推薦使用`th:include`就不另花時間討論了）