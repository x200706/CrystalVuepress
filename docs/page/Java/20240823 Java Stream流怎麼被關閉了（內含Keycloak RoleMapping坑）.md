---
tags:
  - Keycloak
  - Stream
  - Java
---
> 前提：我們都知道了，Stream一但被用完，就沒了

有天為了開發Keycloak SPI，寫了這樣的代碼

```java
//java 
Stream<GroupModel> groups = user.getGroupsStream();

groups.forEach(group -> {
List<String> roleNames = group.getRealmRoleMappingsStream().map(RoleModel::getName).collect(Collectors.toList());
// 又做了某些事情...
}
```

開心打包了個jar包執行



Keycloak服務日誌跟我說：

> java.lang.IllegalStateException: stream has already been operated upon or closed

`;_;...`

---

問題出在哪裡呢？後來追追原始碼，`group.getRealmRoleMappingsStream()`叫出的stream已經是被`filter`過的了（想不到吧囧）



Keycloak原始碼

```java
//java
@Override
public Stream<RoleModel> getRealmRoleMappingsStream() {
    return getRoleMappingsStream().filter(RoleUtils::isRealmRole);
}
```

Uhmmm...那只好先把它收起來轉換成其他格式再做處理吧，不然用不了的...

```java
//java
List<RoleModel> filteredRoleModel = group.getRealmRoleMappingsStream().collect(Collectors.toList()); 
// filteredRoleModel.stream().開一個新流後可以做其他事情
```