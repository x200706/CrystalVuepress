# 20240821 Keycloak SPI開發步驟.md
Keycloak的官方REST API有些小缺點，第一個是文件未免也太...不過這點頭過身體過

另一點是它的回應很隨興，可以理解成或許是有資安考量，但收到類似「未知的例外」描述還寫請人去查看Keycloak log感覺太過了（尤其是以串接方不一定是Keycloak維護者的角度）


或許可以用比較傳統的方式，用自家後端API包起來，請前端打自家API，不過這樣總要多過一層，效能自然會比較差


所以官方提出一種模式－替Keycloak寫外掛，透過製作[SPI](https://www.keycloak.org/docs/latest/server_development/#_providers)，可以擴充Keycloak功能，更可以[創造自己的Keycloak API](https://www.keycloak.org/docs/latest/server_development/#extending-the-server) 

---

SPI最基礎的模式就是一個ProviderFactory跟一個Provider


哪裡找想要實作的ProviderFactory跟Provider？->[Keycloak service-spi-private原始碼](https://github.com/keycloak/keycloak/tree/33776ad8ed482670a877df6bcaa14db049c13d33/server-spi-private) （還是要以自己的Keycloak版本為準，過去版本可能得看Javadoc）


不過如果是自製REST API，官方給了很明確的指示就是針對`RealmResourceProviderFactory`跟`RealmResourceProvider中的Object getResource();`做處理，進而撰寫基於JAX-RS的REST API


一個ProviderFactory要實作的方法 脫離不了[源頭](https://github.com/keycloak/keycloak/blob/33776ad8ed482670a877df6bcaa14db049c13d33/server-spi/src/main/java/org/keycloak/provider/ProviderFactory.java) ProviderFactory

```java
// 需要覆寫實作的抽象方法
T create(KeycloakSession session); // T是指Provider

void init(Config.Scope config);

void postInit(KeycloakSessionFactory factory);

void close();

String getId();
```

```java
import org.keycloak.Config.Scope;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.services.resource.RealmResourceProviderFactory;

import com.google.auto.service.AutoService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@AutoService(RealmResourceProviderFactory.class) // 這個可以取代官方那個描resource的步驟
public class MyRealmResourceProviderFactory implements RealmResourceProviderFactory  {

  @Override
  public MyRealmResourceProvider create(KeycloakSession session) {
    return new MyRealmResourceProvider(session);
  }

  @Override
  public void init(Scope config) {
    // 看看你自己要不要寫log（夢迴Servlet filter）（誤）
  }

  @Override
  public void postInit(KeycloakSessionFactory factory) {
  }

  @Override
  public String getId() {
    return "myApi"; // 這個之後會反映在網址path上
  }

  @Override
  public void close() {
  }

}
```


然後以我選擇的`RealmResourceProvider`來說得實作

```java
// 來自RealmResourceProvider
Object getResource();
// 來自Provider的
void close();
```

```java
import org.keycloak.services.resource.RealmResourceProvider;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MyRealmResourceProvider implements RealmResourceProvider {
    private final KeycloakSession session;

    public MyRealmResourceProvider(KeycloakSession session) {
        this.session = session;
    }
  
    @Override
    public Object getResource() {
      return this;
    }
    
    @Override
    public void close() {
        
    }

    // 然後我就可以在這邊寫基於JAX-RS的REST API了^o^
    // @GET
    // do something..
}
```

> 註：JAX-RS可以用Quarkus或Jersey這些framework