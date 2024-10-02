# 20241002 新·Streamlit大全
Streamlit是一款基於Python可以迅速產生網頁的工具，並支援各種數據分析套件，\
是簡易呈現儀表板的優秀彩現方案，也能使用輸入框跟表單跟頁面做一些ajax互動，\
雖然資料量一大運行速度比一般網頁慢，但官方還有提供線上部署功能，某些情境下蠻實用的～


有鑑於[舊版文章](https://x200706.bearblog.dev/streamlitpandasmurmur/)跟[代碼](https://github.com/x200706/PythonNotebooks/blob/main/%E8%A8%98%E5%B8%B3%E6%9C%AC.ipynb)均太混亂難以參考，這次再針對各功能所需設置／調用重新寫一篇筆記


## 設置應用程式樣式

### 設置按鈕與字型<!-- {"collapsed":true} -->

新增一個`.streamlit`的隱藏資料夾放入`config.toml`的檔案


`config.toml`的檔案內容

```toml
[theme]
# Primary accent for interactive elements
primaryColor = '#719c4c'

# Background color for the main content area
backgroundColor = '#0E1117'

# Background color for sidebar and most interactive widgets
secondaryBackgroundColor = '#0E1117'

# Color used for almost all text
textColor = '#F9F5F5'

# Font family for all text in the app, except code blocks
# Accepted values (serif | sans serif | monospace)
# Default: "sans serif"
font = "sans serif" 
```

### 細部設置頁面CSS<!-- {"collapsed":true} -->

然而上方`config.toml`設置不了頁面最上方的漸層裝飾條顏色，需要額外設置CSS解決此問題


在Streamlit主程式 看要調用還是寫在main（這樣代碼不太好看...）

```python
# 頁面CSS（有些樣式被toml設定檔優先使用，不能從這邊覆蓋）
st.markdown('<style>\
.st-emotion-cache-1dp5vir {\
position: absolute;\
top: 0px;\
right: 0px;\
left: 0px;\
height: 0.125rem;\
background-image: linear-gradient(90deg, #d1ff38, #3cba2f);\
z-index: 999990;\
}\
</style>', unsafe_allow_html=True)
```

### 其他常用頁面布局－主框<!-- {"collapsed":true} -->

```python
# 頁面標題跟寬度設定
st.set_page_config(page_title="蛇蛇工具箱🐍", layout="wide")

# 側欄render
menu_arr = ["功能1", "功能2", "功能3"]
with st.sidebar:
    # 側欄分組與主要內容回填
    menu = option_menu("蛇蛇工具箱", menu_arr,
        icons=[],
        menu_icon="cast", default_index=0)
```

### 其他常用頁面布局－內頁

```python
if menu == "功能1":
    st.title("功能1的內頁大標題")
    st.subheader("功能1的內頁次標題0")
    
    st.info("我是info提示框", icon="⚠️")
    st.success("我是成功提示框")
    st.error("我是錯誤提示框")

    # 頁面分欄&表單範例
    col1, col2 = st.columns(2)    
    with col1:
      st.subheader("功能1的內頁次標題1")
      input1 = st.text_input("我是輸入框1", "")
    with col2:
      st.subheader("功能1的內頁次標題2")
      input2 = st.text_input("我是輸入框2", "")
    if st.button("我是按鈕"):
```

### 化解官方線上部署出現任何圖表套件的中文顯示問題<!-- {"collapsed":true} -->

[~~如何在 matplotlib 視覺物件中使用中文字體 - 社區雲 - Streamlit~~](https://discuss.streamlit.io/t/how-to-use-chinese-font-in-matplotlib-visuals/7895) ~~還要配合這篇服用~~[~~Ubuntu安装中文语言包-CSDN博客~~](https://blog.csdn.net/zx593669703/article/details/127425225) 

↑這方法不奏效了一直安裝不到-.-

那就[放字型檔案再調用各圖表的函式](https://discuss.streamlit.io/t/after-the-deployment-of-streamlint-cloud-the-images-drawn-by-matplotlib-cannot-be-displayed-in-chinese-but-can-be-displayed-when-running-locally/43366/3)化解這個問題吧...

可參考[matplotlib 顯示中文 - DEV Community](https://dev.to/codemee/matplotlib-xian-shi-zhong-wen-4998) 跟[matplotlib_show_chinese_in_colab.ipynb - Colab (google.com)](https://colab.research.google.com/github/willismax/matplotlib_show_chinese_in_colab/blob/master/matplotlib_show_chinese_in_colab.ipynb) 

---

## 常用輸入框

官方文件：[Input widgets - Streamlit Docs](https://docs.streamlit.io/develop/api-reference/widgets) 

## 各數據分析或圖表套件調用<!-- {"collapsed":true} -->

這部分閱讀[官方文件](https://docs.streamlit.io/)大多有不錯的解說步驟，此處僅列一些個人常用或踩過又相對難排除的坑

### st與Pandas<!-- {"collapsed":true} -->

```python
st.session_state.df = pd.read_csv(file_path) # 存放你的df
st.dataframe(df)
```

---

---

## 附錄：目前線上用過的Python環境比較

GCP或其他VM自架的跟電腦差不多就跳過；PythonAnywhere有申請但還沒真的用過OAO

|平台→<br />↓項目<!-- {"cell":{"colwidth":191}} -->|insCode|Streamlit|Google Colab|
|-|-|-|-|
|基礎<!-- {"cell":{"colwidth":191}} -->|一個Linux容器，可以運行右邊兩者|一個有限的Linux容器，主要用來運行Streamlit|一個有限的Linux容器，主要用來運行Jupyter Notebook|
|編輯區<br />是否好用<!-- {"cell":{"colwidth":191}} -->|中規中矩但目前沒有深色模式|部署完後可在GitHub儲藏庫按`.`進入線上VSCode，<br />具體來說是個網頁應用程式...所以沒有固定IDE|中規中矩，可以跟Markdown混寫；有若干種深色模式|
|Linux終端機的使用&<br />安裝Linux套件的自由度<br />（撇除解壓縮等神操作）<!-- {"cell":{"colwidth":191}} -->|有個終端機工具可以用，但不能用root執行；nix上有的大多能安裝|只能到APP看運行狀況（或許能用Python執行套件）；使用`package.txt`安裝，但某些套件抓不到（例如中文語言包...），比較驚奇的是據說連jre都能裝？！|也是只能看運行結果；可以用`!`連接Linux指令，自由度算高|
|作為一個服務提供給<br />使用者的潛力|用這種網頁程式封裝🆗<br />但須注意沒部署的話關掉IDE服務也會關閉|可以直接產生一個簡易雅觀的網頁介面，<br />不過牽扯若到驗證授權（登入功能）會需要很多額外撰寫與配置，<br />可能比較適合做為開放在網路上的工具供人使用／檢視|用這種網頁程式封裝+搭配ngrok使用🆗，但較少人這樣用<br />通常是分享筆記本|
|服務部署速度|中等|commit一推馬上就變，超快！|有點慢...|
|已知bug|代碼有時候會自己回溯到前一個版本|刪除某APP，再以相同URL部署新APP，會出現"無權訪問APP或APP不存在"之提示，可以先把APP改為用沒用過的URL，成功訪問後再改成你要的URL||
