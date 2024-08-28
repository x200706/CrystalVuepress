---
tags:
  - Docker
---
# 20240828 Cloud上Docker image架構不合問題

某天上班AWS ECS一直部署失敗，從部署下方事件那邊ref到失敗的任務點進去看，他說容器exit 1

蛤


~~我完美的image，在電腦上超work的啊（拖走） 溫馨提醒：不要常說「這在我電腦上能動」~~


開始旋轉腦袋：

- 是Dockerfile因為分支不同導致變數不同連不到DB嗎？不是

- 一開始還以為是因為image內來自官方的有高風險，後來水落石出發現，也不是欸


> 補充：常常有人說ECS健康檢查是指負載平衡健康檢查，多在檢查有無憑證、流量等問題，\
> 並不會檢查image有無風險這個項目，另外就算部署時事件顯示unhealth，也還是能部署成功，看設定不健康的閥值吧


那就開始通靈吧（咦）

看了些參考資料，甚麼狀況會exit 1，像是：

- Dockerfile一開始就是寫錯

- image損毀

- 處理器架構不同

- 某些image仰賴某些發行版，但你疊錯了

然後我望向Windows公司電腦，我頓時充滿了靈感...囧...

---

## 解決辦法

Windows使用者若ECS任務描定ARM64架構，放下你手上的`docker compose build`


改用這個：

```ps1
docker buildx build --platform linux/amd64,linux/arm64 -t 映像名稱 Dockerfile所在目錄
```

最後你就會得到一個ARM64的image `✧*｡٩(ˊᗜˋ*)و✧*｡`\
![](https://images.amplenote.com/dd58d462-650f-11ef-a7b1-b6c19b417745/b417ce6a-9372-471c-8819-b277cf7c5dbe.png)



#### 備註：某些電腦會出現這個提示
```
ERROR: Multi-platform build is not supported for the docker driver.
Switch to a different driver, or turn on the containerd image store, and try again.
Learn more at https://docs.docker.com/go/build-multi-platform/ 
```
就是說你的電腦`--platform`後方只能帶一個平台