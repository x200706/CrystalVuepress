# 20240827 MySQL實用用法：獲得Table最後一個自增ID&變數

```sql
-- 前提 another_table有個自增欄位叫做id，表中ref_id跟id關聯（情境如樹狀選單）
INSERT INTO another_table (ref_id, other_column) VALUES (2, 'some_value');
-- 假設我們想要上個語句的自增id
SET @last_id = LAST_INSERT_ID();
INSERT INTO another_table (ref_id, other_column) VALUES (@last_id, 'some_value');
```

需要注意的是`LAST_INSERT_ID()`是目前連線上下文中最後插入的自增id，

如果當前連線session是高併發的環境，

那`LAST_INSERT_ID()`就有可能不是我們期望的了，化解方法：

- 積極：ID分配表

- 消極（？）：使用uuid

---

### 補充：連線上下文

這邊是指每個session，跟連線位置無關


舉例來說現在電腦開著一個DB連線工具跟一個Spring Boot服務，都連接著同個DB—這樣是兩個各自獨立的session