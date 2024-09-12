---
tags:
  - JPA
---
# 20240912 Spring Data JPA Criteria原生複雜查詢與Join寫法
若基於各種原因（系統穩定度或其他考量），不想給Spring Boot安裝QueryDSL，

其實Criteria就有內建複雜查詢的功能，不用再回去寫JPQL

## 代碼

> 註：這邊稍微偷懶簡化架構沒有儲藏庫

### DAO 快去繼承`JpaSpecificationExecutor<>`!!

```
@Repository
public interface XxxDao extends JpaRepository<XxxPO, Integer>, JpaSpecificationExecutor<XxxPO> {
}
```

### Service

```java
// java
// 複雜查詢規格拼裝
Specification<XxxPO> spec = (root, query, builder) -> {
  List<Predicate> predicates = new ArrayList<>();

  Join<XxxPO, XyyPO> xyJoin = root.join("XyyPO", JoinType.LEFT);

  if (yId != null) {
      predicates.add(builder.equal(xyJoin.get("yId"), yId));
  }
  if (StringUtils.isNotBlank(xKind)) {
      predicates.add(builder.equal(xyJoin.get("xKind"), xKind));
  }
  return query.getRestriction();
};
// 使用複雜查詢規格查詢
List<XxxPO> xxxPO = XxxDAO.findAll(spec);
```

### Murmur Time

- JPQL純語句可能也不是很好維護？不過程式碼是最少的，設置好後只管調用就行`^^;;`

- Expression跟Path是父跟子的繼承關係，不過就是意義上不太一樣，雖然都能用就是 ~~上面的例子甚至懶得接值丟進builder~~

    - 引發一個想法：這種情境Java 17用var接值會是甚麼？<-應該會是他本來要Return的東西

        - 不管是用root的get()方法，還是Join類，都是Path，不過坊間蠻多人用Expression接

        - 
          ```java
          //java
              <Y> Path<Y> get(String attributeName);
          ```

- 有些人不會`return query.getRestriction();`，而是`return builder.and(predicates.toArray(new Predicate[0]));`

    - 後者比較靈活點或許還能拼接其他條件吧，前者就是只能拿到已經設置的條件

- builder就是CriteriaBuilder，query就來自builder，root來自query，如果不用Specification寫法會長這樣

    - 
      ```java
      //java
      // 某Repository
      @PersistenceContext
      private EntityManager entityManager;
      
      // 某個複雜查詢方法體
      CriteriaBuilder builder = entityManager.getCriteriaBuilder();
      CriteriaQuery<ChannelSellingProductPO> query = builder.createQuery(XxxPO.class);
      Root<ChannelSellingProductPO> root = query.from(XxxPO.class);
      // ry
      ```

    - 所以上一點提到`return builder.and(predicates.toArray(new Predicate[0]));`還可以再退化成`query.select(root).where(predicates.toArray(new Predicate[0]));`

        - 搭配`entityManager.createQuery(query).getResultList();`就不用`XxxDAO.findAll(spec);`，會直接得到查詢結果

    - 感受到這個Lambda簡化很多事情吧\~\~

---

## 參考資料

- [Spring Data JPA：解析CriteriaBuilder - 时空穿越者 - 博客园 (cnblogs.com)](https://www.cnblogs.com/studyLog-share/p/15190011.html) 

- [JPA 原生的複雜查詢 Specification - Bingdoal's Note](https://bingdoal.github.io/backend/2023/01/jpa-complex-query-with-specification/) 