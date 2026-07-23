# 《西安游迹》开发记录与交接说明

> 更新日期：2026-07-23
> 当前版本：v1.0.0（区域交互与实时搜索已完成）
> 用途：记录当前功能、数据结构、关键决定和历史开发过程，供后续开发快速恢复上下文。
> 阅读提示：第一部分是当前最新基准；第二至第四部分为历史阶段记录；第五部分记录预约功能；第六部分记录美食 JPG 图片接入；第七部分记录区域交互与实时搜索。

# 第一部分：当前最新状态（截至 2026-07-23）

## 1. 产品与技术定位

《西安游迹》是一款以西安示意地图为入口，按区域查看景点、美食，并辅助个人旅行规划的轻量微信小程序。

- 使用微信原生小程序和原生 `map` 组件。
- 内容由本地 JavaScript 数据文件驱动。
- 不使用服务器、数据库、账号系统或第三方地图 SDK。
- 不保存用户位置，不在页面加载时自动申请定位。
- 地图坐标只作为旅行参考，实际入口和门店信息以官方或商家最新信息为准。

## 2. 当前内容规模

- 5 个旅行区域。
- 13 个景点，全部具有 GCJ-02 参考坐标。
- 13 个景点均具有统一 `reservation` 数据和官方来源核实记录。
- 9 条美食，其中 2 条具有已确认的参考坐标。
- 9 条美食均已接入本地 JPG，共 19 张。
- 1 个地图特殊地点：西安奥体中心。

## 3. 当前交互与地图能力

### 3.1 首页与横屏全屏地图

- 首页地图展示区域入口、精选景点、特殊地点和用户主动定位结果。
- `pages/full-map` 提供横屏全屏地图，复用首页的地图数据与点击规则。
- `map-config.js` 统一管理默认中心、默认缩放级别 12、定位后缩放级别 14、精选景点和周边参数。
- 当前精选景点为西安钟楼、大雁塔·大慈恩寺、陕西历史博物馆、洒金桥和大唐不夜城。
- 精选景点 marker 点击进入 `detail?id=景点ID`。
- `map-points.js` 管理仅用于地图展示的特殊地点；西安奥体中心显示在首页和 full-map，点击不跳转。

### 3.2 place-map 周边探索

- 保留当前景点 marker，并从 `places.js` 中排除当前景点后查找附近景点。
- `map-utils.js` 提供坐标校验、两点距离计算和附近景点筛选。
- 搜索半径为 3 公里，按距离升序最多展示 5 个附近景点。
- 当前景点 marker 点击不跳转；附近景点 marker 点击进入对应详情。
- 使用 `include-points` 自动调整当前景点与附近景点的地图范围。
- 特殊地点不参与周边探索。

### 3.3 美食地图与地图导航

- food-map 展示具有可靠坐标的美食参考门店。
- 点击当前美食 marker 时校验 marker ID、food 数据和页面来源，然后使用 `wx.navigateBack()` 返回对应 food-detail。
- `location-utils.js` 统一封装 `wx.openLocation`。
- 景点详情和具有有效坐标的美食详情显示导航按钮；无有效坐标时隐藏入口。
- 景点使用 `place.name`，美食使用 `food.shop || food.name` 作为地图地点名称。
- 小程序只打开微信原生地图，不自行实现路线规划。

### 3.4 景点官方预约信息

- `places.js` 中 13 个景点均增加统一 `reservation` 对象，记录预约状态、渠道类型、平台名称、操作说明、官方来源、来源网址和核实日期。
- 核实日期统一为 `2026-07-22`，只采用景区、博物馆或政府官方页面公开的信息。
- 当前渠道分布为：4 个官方微信公众号、2 个官方网页、4 个无需预约、3 个暂未确认。
- 没有任何景点的微信小程序 `appId` 与 `path` 同时得到可靠确认，因此当前不启用小程序直跳。
- 公众号类型点击“预约参观”后显示公众号名称，并支持复制。
- 官方网页受小程序 `web-view` 业务域名限制，当前只展示说明并复制官方网址，不伪装成可直接打开。
- 无需预约和暂未确认类型只显示明确状态，不显示操作按钮。
- 预约功能仅属于景点详情，不写入美食数据。

### 3.5 区域交互与实时搜索

- 首页地图下方提供内嵌实时搜索，点击入口后在当前页面展开输入框，不再跳转 `pages/search`。
- 区域页在区域介绍下方提供内嵌实时搜索，搜索范围只使用当前 `regionId` 已筛选的景点和美食。
- `search-utils.js` 统一匹配景点与美食的 `name` 字段，名称开头匹配优先，再展示其他包含匹配，最多返回 5 条。
- 联想结果统一保存类型、图标、名称和详情地址；景点进入 `detail`，美食进入 `food-detail`。
- 空关键词隐藏联想面板，无结果时显示明确提示。
- 区域页景点、美食分类采用手风琴交互，默认全部收起；两个分类互斥展开，再次点击当前分类时收起。
- `pages/search` 继续保留并注册，复用公共搜索工具，但首页和区域页当前均不再跳转至该页面。

## 4. 当前页面与数据结构

```text
miniprogram/
├── data/
│   ├── regions.js
│   ├── places.js
│   ├── foods.js
│   ├── map-config.js
│   └── map-points.js
├── utils/
│   ├── map-utils.js
│   ├── location-utils.js
│   └── search-utils.js
└── pages/
    ├── home/
    ├── full-map/
    ├── region/
    ├── search/
    ├── detail/
    ├── place-map/
    ├── food/
    ├── food-detail/
    └── food-map/
```

## 5. 当前核心流程

```text
home
├── 区域卡片 → region?id=区域ID
├── 内嵌实时搜索 → detail?id=景点ID / food-detail?id=美食ID
├── 精选景点 marker → detail?id=景点ID
├── 特殊地点 marker → 不跳转
├── 放大按钮 → full-map
└── 定位按钮 → 显示用户当前位置

region
├── 当前区域内嵌实时搜索 → detail?id=景点ID / food-detail?id=美食ID
├── 景点分类 → 展开 / 收起景点列表
└── 美食分类 → 展开 / 收起美食列表

detail
├── 参考位置 → place-map?id=景点ID
├── 导航按钮 → wx.openLocation
└── 预约信息
    ├── 官方公众号 → 弹窗说明并复制公众号名称
    ├── 官方网页 → 弹窗说明并复制网址
    ├── 无需预约 → 只显示状态
    └── 暂未确认 → 只显示提示

place-map
└── 附近景点 marker → detail?id=附近景点ID

food-detail
├── 参考位置 → food-map?id=美食ID
└── 导航按钮 → wx.openLocation

food-map
└── 当前美食 marker → navigateBack 返回 food-detail
```

## 6. 当前版本与验证状态

- 地图探索与导航功能已在此前阶段完成并上传 GitHub。
- 景点预约与美食 JPG 图片功能已完成，纳入 2026-07-22 阶段收尾。
- 预约功能相关 JavaScript 语法、WXML 标签、WXSS 大括号和 Git diff 格式检查均已通过。
- 已核对 13 个景点全部具有预约数据；公众号和网页的复制成功、复制失败、取消及缺失字段分支已完成静态模拟。
- 已核对 9 条美食与 9 个图片目录一一对应；19 张 JPG 均非空、可解码，引用路径和大小写完全一致。
- 已完成公共搜索工具、首页实时搜索、区域内搜索和手风琴状态的 JavaScript 语法与静态状态模拟。
- 已验证首页搜索覆盖全部内容，区域搜索不会返回其他区域内容，联想结果最多 5 条且名称开头匹配优先。
- 地图功能开发完成时已对相关 JavaScript 文件执行语法检查。
- 横屏、定位授权、原生地图层级、`wx.openLocation`、预约弹窗、剪贴板、实时输入、自动聚焦和小屏布局仍应在微信开发者工具与真机持续回归。
- `miniprogram/project.config.json` 属于本机开发者工具配置，除非明确要求，不纳入功能提交。

## 7. 后续方向

1. 在微信开发者工具和真机完成 13 个景点预约信息的逐项测试。
2. 根据测试结果决定是否增加预约按钮防重复点击及更严格的状态校验。
3. 设计并实现三日行程页面。
4. 补充具有可靠来源和使用权限的景点图片。
5. 继续核对开放时间、门票、预约和门店信息。
6. 在微信开发者工具与 iPhone 真机回归首页及区域页的实时联想、键盘和返回流程。

# 第二部分：历史阶段状态（2026-07-21 文档同步前基线）

> 本部分原为 v1.0.0 当前项目状态，现作为阶段快照保留。其 3 个精选 marker、单点 place-map、无导航等描述已被第一部分取代。

## 1. 当前定位与技术原则

《西安游迹》（XI'AN TRAVEL GUIDE）是一个微信小程序旅行助手，以西安地图为入口，按区域展示景点和美食，并提供开放时间、门票、游览建议和参考位置等旅行信息。

当前技术与产品原则：

- 使用微信原生小程序和原生 `map` 组件。
- 使用 `miniprogram/data/` 下的本地 JavaScript 数据驱动页面。
- 通过稳定英文 `id` 关联区域、景点、美食和详情页面。
- 位置功能只用于旅行参考，不实现导航、路线规划或附近搜索。
- 定位只在用户主动点击后触发，不保存用户位置。
- 不使用服务器、数据库、登录系统或后台持续定位。
- 未确认的门店坐标和图片不强行补充。

## 2. 当前功能

### 2.1 首页地图与精选景点

首页 `pages/home` 当前包含：

- 西安地图，默认中心为纬度 `34.341568`、经度 `108.940174`，缩放级别 `12`。
- 3 个精选景点 marker：钟楼、大雁塔、兵马俑。
- 独立配置 `featuredMarkerConfig`，通过 `placeId` 从 `places.js` 查询景点。
- 对景点不存在或坐标无效的数据进行过滤。
- marker 名称使用配置中的短标签。
- 使用明确的 `markerId -> placeId` 映射，不依赖景点数组顺序。
- 点击 marker 后进入对应景点详情页。
- 区域卡片由 `regions.js` 驱动，点击后进入区域攻略页。

精选 marker 数据流：

```text
featuredMarkerConfig
  ↓ placeId 查询
places.js
  ↓ 过滤无效数据
markers + markerIdToPlaceId
  ↓ bindmarkertap
pages/detail/detail?id=景点ID
```

### 2.2 用户当前位置

首页地图右下角已增加定位按钮：

- 使用 `cover-view` 显示圆形按钮。
- 页面加载时不自动申请定位权限。
- 用户点击后调用 `wx.getLocation({ type: 'gcj02' })`。
- 定位成功后更新地图中心，缩放级别设置为 `14`。
- 开启 `showUserLocation`，在地图上显示用户位置。
- 使用 `isLocating` 防止定位期间重复点击。
- 定位失败时提示检查定位权限或系统定位设置。

`app.json` 已增加前台定位声明：

```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "用于在首页地图中显示您的当前位置"
    }
  },
  "requiredPrivateInfos": ["getLocation"]
}
```

### 2.3 区域攻略

区域攻略页 `pages/region` 同时读取 `regions.js`、`places.js` 和 `foods.js`：

- 根据 URL 参数 `id` 查询当前区域。
- 按 `regionId` 筛选当前区域的景点。
- 按 `regionId` 筛选当前区域的美食。
- 景点卡片进入景点详情页。
- 美食卡片进入美食详情页。
- 无数据时显示友好空状态。

酒店模块已移出当前产品范围，相关数据筛选、页面区块和样式已删除。

### 2.4 景点详情与游览信息

景点详情页 `pages/detail` 根据 `options.id` 查询 `places.js`，再按 `place.regionId` 查询 `regions.js`。

页面当前展示：

- 景点名称、所属区域和摘要。
- 开放时间 `openTime`。
- 门票信息 `ticket`。
- 建议游览时长 `duration`。
- 详细介绍 `description`。
- 地址、推荐理由、标签。
- 注意事项数组 `notice`。
- 有有效坐标时显示“查看参考位置”按钮。

景点字段已完成统一：

```text
openingHours → openTime
tips         → notice
```

景点业务代码中已没有旧字段引用。

### 2.5 景点参考位置

景点参考地图页 `pages/place-map` 已完成：

- 接收 `options.id` 并从 `places.js` 查询景点。
- 根据 `regionId` 查询所属区域。
- 检查经纬度是否为有效数字。
- 有效时显示景点名称、所属区域、地址和单个 marker。
- 无效时显示错误状态，不显示空地图。
- 明确提示位置仅供旅行参考，实际入口和现场信息以景区最新情况为准。
- 不提供导航、路线规划和附近搜索。

当前 13 个景点都具有数字坐标，因此均可查看参考位置。

### 2.6 美食分类与详情

美食数据集中保存在 `foods.js`。独立美食页 `pages/food` 支持按区域筛选；当前主要浏览路径是“首页 → 区域攻略 → 美食详情”。

美食详情页 `pages/food-detail` 展示：

- 美食名称、类型、所属区域。
- 摘要和参考价格。
- 图片或图片占位状态。
- 详细介绍、推荐店铺和地址。
- 推荐理由、标签和注意事项。
- 有有效坐标时显示“查看参考位置”按钮。
- 无效 ID 对应的明确错误状态。

### 2.7 美食参考位置

美食参考地图页 `pages/food-map` 已完成：

- 接收 `options.id` 并从 `foods.js` 查询美食。
- 检查经纬度是否为有效数字。
- 有效时显示美食名称、推荐店铺、地址和单个 marker。
- 无效时显示错误状态，不显示空地图。
- 明确提示位置仅供旅行参考，实际门店信息以商家最新情况为准。
- 不提供导航或路线规划。

当前 9 条美食中有 2 条具有已确认的数字坐标。其余美食不显示参考位置按钮。

## 3. 当前页面结构

```text
miniprogram/pages/
├── home/          首页地图、精选 marker、用户定位和区域入口
├── region/        区域攻略
├── detail/        景点详情
├── place-map/     景点参考位置地图
├── food/          美食分类展示
├── food-detail/   美食详情
├── food-map/      美食参考位置地图
└── index/         初始工程保留页面，当前不是启动首页
```

`app.json` 将 `pages/home/home` 放在页面数组第一项，因此首页地图是应用启动页。

## 4. 当前数据结构

### 4.1 区域 `regions.js`

```js
{
  id,
  name,
  summary,
  tags
}
```

当前共有 5 个旅行区域。

### 4.2 景点 `places.js`

```js
{
  id,
  regionId,
  latitude,
  longitude,
  type,
  name,
  summary,
  description,
  address,
  openTime,
  ticket,
  duration,
  recommend,
  notice,
  tags,
  image
}
```

当前共有 13 个景点，全部具有 GCJ-02 数字坐标。

### 4.3 美食 `foods.js`

```js
{
  id,
  regionId,
  latitude?,
  longitude?,
  type,
  name,
  shop,
  summary,
  description,
  address,
  price,
  recommend,
  tips,
  tags,
  image
}
```

当前共有 9 条美食。经纬度为可选字段，目前 2 条具有数字坐标。

## 5. 当前核心页面流

```text
首页 home
  ├── 区域卡片 → region?id=区域ID
  ├── 精选 marker → detail?id=景点ID
  └── 定位按钮 → 获取并显示用户当前位置

区域攻略 region
  ├── 景点卡片 → detail?id=景点ID
  └── 美食卡片 → food-detail?id=美食ID

景点详情 detail
  └── 有坐标 → place-map?id=景点ID

美食详情 food-detail
  └── 有坐标 → food-map?id=美食ID
```

## 6. 当前验证状态

截至 2026-07-21，已完成以下静态核对：

- `regions.js` 可加载 5 个区域。
- `places.js` 可加载 13 个景点，13 个均有数字坐标。
- `foods.js` 可加载 9 条美食，2 条有数字坐标。
- 首页精选配置能够匹配钟楼、大雁塔和兵马俑。
- marker 点击使用稳定 ID 映射。
- 景点详情已使用 `openTime` 和 `notice`。
- 景点和美食参考地图都具有无效数据错误状态。
- 首页定位仅在用户点击后触发。
- `app.json` 已注册当前页面并配置前台定位权限。
- README 已更新到 v1.0.0 并推送至 GitHub `main`。

仍需在微信开发者工具和真机中持续回归：

- 首次授权、拒绝授权和系统定位关闭时的表现。
- 原生地图与 `cover-view` 在不同机型上的层级和布局。
- 景点、美食详情长文本布局。
- 全部页面跳转、返回和 marker 点击行为。

## 7. Git 与本地配置

- 当前主分支为 `main`，远端为 `origin/main`。
- GitHub 仓库：`jiangzhengyi0221/xian-travel-guide`。
- 地图定位体系和参考位置功能提交：`0da089b`。
- README v1.0.0 提交：`0c8490b`。
- 项目源码和 README 已推送至 GitHub。
- `miniprogram/project.private.config.json` 已被 `.gitignore` 忽略。
- `miniprogram/project.config.json` 存在本地 AppID 和基础库版本调整，按约定不提交。

## 8. 已知边界与风险

- 开放时间、门票、预约方式和美食门店情况可能变化，出发前需核对官方或商家最新信息。
- 地图坐标仅供旅行参考，不能替代景区入口、门店最新地址或专业导航。
- 用户拒绝定位后当前只显示统一失败提示，尚未提供直接打开设置页的引导。
- 模拟器地图和定位表现不能完全代表真机。
- 图片数据目前多数为空，页面使用占位状态。
- `pages/index` 是初始工程保留页面，后续可评估是否清理。

## 9. 后续规划

优先事项：

1. 在微信开发者工具和真机完成 v1.0.0 全流程测试。
2. 根据朋友体验反馈优化首页、地图交互和详情信息层级。
3. 临近出行时再次核对开放时间、门票和门店信息。

后续功能：

1. 三日行程页面。
2. 景点与美食图片完善。
3. 用户体验和异常状态优化。
4. 逐步补充可靠的美食固定门店坐标。

暂不扩展：

- 导航和路线规划。
- 附近搜索。
- 后台持续定位。
- 用户位置保存。
- 服务器、数据库和账号系统。

## 10. 下次开发前建议读取

1. `README.md`
2. `docs/development-log.md`
3. `docs/product.md`
4. `docs/content-plan.md`
5. `miniprogram/app.json`
6. `miniprogram/data/regions.js`
7. `miniprogram/data/places.js`
8. `miniprogram/data/foods.js`
9. 准备修改的具体页面文件

## 11. 协作约定

- 修改前先检查当前代码和全项目引用，不依据旧记录直接修改。
- 按小范围分阶段完成分析、实现、测试和提交。
- 不强行补充无法确认的坐标、票价、开放时间和图片。
- 提交时明确暂存文件，不使用无差别暂存覆盖本地配置。
- 除非用户明确要求，不提交 `miniprogram/project.config.json`。

# 第三部分：2026-07-21 地图探索与导航功能完善

## 1. 地图配置抽离

- 新增 `miniprogram/data/map-config.js`。
- 统一管理默认地图中心、缩放级别、定位后缩放级别、精选地点 ID、周边半径与数量上限。
- home 与 full-map 复用同一份精选地点配置，保留原有 marker 生成与 ID 映射方式。

## 2. 全屏地图与特殊地点

- 新增 `pages/full-map` 横屏全屏地图页面。
- 保留精选景点 marker、景点详情跳转和用户主动定位。
- 新增 `miniprogram/data/map-points.js`，建立与 `places.js` 分离的地图特殊地点系统。
- 西安奥体中心只在 home 与 full-map 显示，点击不跳转，也不进入详情、区域和周边探索。

## 3. place-map 周边探索

- 新增 `miniprogram/utils/map-utils.js`，提供坐标有效性判断、两点距离计算和附近景点查找。
- place-map 从单点参考地图升级为“当前景点 + 附近景点”。
- 排除当前景点，在 3 公里范围内按距离排序，最多展示 5 个附近景点。
- 建立 marker ID 到景点 ID 的映射；当前 marker 不跳转，附近 marker 进入详情。
- 增加 `include-points`，根据当前点与附近点自动调整地图范围。

## 4. food-map 点击返回

- food-map 增加 marker 点击事件。
- marker ID、food 数据和页面来源校验通过后，使用 `wx.navigateBack()` 返回上一层对应 food-detail。
- 保持原有 `food-detail → food-map` 参数和进入流程不变。

## 5. 景点与美食导航

- 新增 `miniprogram/utils/location-utils.js`，统一通过 `wx.openLocation` 打开微信地图。
- 景点详情与美食详情仅在经纬度有效时显示导航按钮。
- 景点使用景点名称；美食优先使用推荐店铺名称，否则使用美食名称。
- 未引入第三方地图 SDK，也未自行实现路线规划。

## 6. 版本记录

- Commit：`7360dd042d61e0e2cfdc262a698b378a9e3d957a`
- Commit message：`feat: 完善地图探索与导航功能`

# 第四部分：历史开发记录（2026-07-19 至 2026-07-20）

> 本部分保留早期开发过程，便于追溯设计演变。其字段名、功能数量、Git 状态和“下一步”描述可能已经被第一部分的最新状态取代。

## 1. 项目目标

《西安游迹》是一款使用微信原生小程序开发的个人西安旅行手册，主要用于：

- 按区域查看西安景点和美食。
- 从区域攻略页进入地点详情页。
- 查看地点简介、详细介绍、地址、推荐理由和实用提醒。
- 后续增加三日行程页面。
- 使用本地数据，不使用服务器、数据库、登录和第三方地图 API。

第一版保持简单，适合初学者理解和维护。

## 2. 本次对话形成的技术原则

- 使用微信原生小程序。
- 页面数据集中保存在 `miniprogram/data/`。
- 区域使用稳定英文 `id` 关联页面和地点。
- 首页和区域页不重复手写同一份区域信息。
- 地点列表使用短摘要 `summary`。
- 地点详情使用长介绍 `description`。
- `tags` 和 `tips` 使用数组，方便 WXML 使用 `wx:for`。
- 图片字段暂时保留空字符串，不引用不存在的资源。
- 页面跳转使用 URL 查询参数传递稳定 ID。

## 3. 今日开发过程

### 3.1 初始项目检查

阅读并检查：

- `docs/product.md`
- `docs/content-plan.md`
- `miniprogram/app.js`
- `miniprogram/app.json`
- `miniprogram/app.wxss`
- 微信默认 `index` 页面
- 默认自定义导航栏组件

当时结论：微信基础工程已经创建，但默认 `index` 只是模板页，业务开发尚未开始。

### 3.2 创建真正的首页

创建：

```text
miniprogram/pages/home/
├── home.js
├── home.json
├── home.wxml
└── home.wxss
```

首页包含：

- 标题“西安游迹”
- 副标题“我的西安三日旅行手册”
- 西安示意地图占位区
- 区域按钮
- 区域卡片
- “我的三日行程”入口

`app.json` 已将 `pages/home/home` 放在页面数组第一项，因此它是启动首页。

### 3.3 建立区域数据

创建：

```text
miniprogram/data/regions.js
```

区域对象结构：

```js
{
  id,
  name,
  summary,
  tags
}
```

首页通过：

```js
const regions = require('../../data/regions.js')
```

读取区域数据，并使用 `wx:for` 自动生成区域卡片。

### 3.4 创建区域攻略页

创建：

```text
miniprogram/pages/region/
├── region.js
├── region.json
├── region.wxml
└── region.wxss
```

页面预留并实现：

- 区域标题
- 区域简介位置
- 景点区域
- 美食区域
- 酒店区域
- 地点卡片和空状态

### 3.5 首页跳转到区域页

首页区域卡片点击流程：

```text
item.id
  ↓
data-id
  ↓
home.js 的 goToRegion()
  ↓
wx.navigateTo('/pages/region/region?id=区域ID')
```

区域页通过 `onLoad(options)` 接收 `options.id`，然后在 `regions.js` 中使用 `find()` 查询区域对象。

### 3.6 创建地点数据并按类型分类

创建：

```text
miniprogram/data/places.js
```

区域页先按 `regionId` 筛选当前区域地点，再按 `type` 分类：

```js
const regionPlaces = places.filter(item => item.regionId === region.id)
const attractions = regionPlaces.filter(item => item.type === 'attraction')
const foods = regionPlaces.filter(item => item.type === 'food')
const hotels = regionPlaces.filter(item => item.type === 'hotel')
```

WXML 分别显示景点、美食和酒店；没有数据时显示友好空状态。

### 3.7 创建地点详情页

创建：

```text
miniprogram/pages/detail/
├── detail.js
├── detail.json
├── detail.wxml
└── detail.wxss
```

区域页地点卡片使用 `navigator`：

```xml
url="/pages/detail/detail?id={{place.id}}"
```

详情页使用 `find()` 根据 `options.id` 查询完整地点对象。

### 3.8 扩充核心区域和地点数据库

区域从 3 个扩充为 5 个：

```text
yanta  → 雁塔区
beilin → 碑林区
lianhu → 莲湖区
center → 钟鼓楼区域
lintong → 临潼区
```

其中 `center` 是旅行规划使用的游览区域，不代表正式行政区。

地点扩充为 13 个：

```text
雁塔区
├── 陕西历史博物馆
├── 大雁塔·大慈恩寺
├── 大唐不夜城
└── 大唐芙蓉园

碑林区
├── 西安城墙
├── 西安碑林博物馆
└── 书院门文化街

莲湖区
├── 回民街
└── 洒金桥

钟鼓楼区域
├── 西安钟楼
└── 西安鼓楼

临潼区
├── 秦始皇兵马俑博物馆
└── 华清宫
```

### 3.9 增加地点详细介绍

根据用户提供的 13 份地点资料，为每个地点增加 `description` 字段。

`summary` 与 `description` 的职责：

```text
summary     → 区域页卡片短介绍
description → 详情页多段完整介绍
```

每个 `description` 都是字符串，并通过 `\n\n` 保存为 3 个段落。

详情页已增加“详细介绍”区域，并通过：

```xml
{{place.description}}
```

显示长文。WXSS 使用 `white-space: pre-wrap` 保留段落空行。

### 3.10 首页区域同步和样式优化

阶段检查时发现：

- 区域卡片已经从 `regions.js` 自动生成。
- 地图按钮仍手写旧的 3 个区域。
- 首页仍有“三片城区”固定文案。
- `center` 和 `lintong` 没有卡片颜色。
- 区域标签尚未显示。

已完成优化：

- 地图按钮和区域卡片都使用 `wx:for="{{regions}}"`。
- 地图和卡片共享同一个 `regions` 数组。
- 数量提示使用 `{{regions.length}}`。
- 地图按钮也可以跳转区域页。
- 建立 5 个低饱和主题色。
- 主题使用 `index % 5` 自动分配，新区域无需增加 ID 专属 CSS。
- 首页区域卡片显示 `regions.tags`。
- 删除 `region.wxss` 中未使用的 `.place-section*` 遗留样式。

### 3.11 建立 Git 和 GitHub 版本管理

阶段开发完成后，对项目版本管理进行了修复和初始化：

- 确认原有 `.git` 是空目录，不是有效 Git 仓库。
- 在确认项目代码完整后，删除空的 `.git` 并重新执行 Git 初始化。
- 默认分支设置为 `main`。
- 新增根目录 `.gitignore`，忽略微信开发者工具的本机个人配置 `miniprogram/project.private.config.json`。
- 创建首次提交：`370c73b Initial commit: 西安游迹小程序基础版本`。
- 创建并连接 GitHub 仓库 `jiangzhengyi0221/xian-travel-guide`。
- 将本地 `main` 分支成功推送到 GitHub，并建立 `origin/main` 跟踪关系。

随后在项目根目录增加 `README.md`，内容包括项目简介、当前功能、技术栈和 `v0.98` 完成情况，并创建提交：

```text
2424f11 docs: 添加项目 README
```

README 已同步到 GitHub 仓库首页。当前 Git 提交和 GitHub 远程内容一致。

补充说明：Git 的提交和推送功能已经可用；GitHub CLI（`gh`）中保存的旧 token 仍然失效。该问题不影响普通 `git push`，以后需要使用 `gh` 创建 Pull Request 或 Issue 时，应重新执行 `gh auth login -h github.com`。

## 4. 当前数据结构

### 4.1 区域

```js
{
  id,
  name,
  summary,
  tags
}
```

### 4.2 景点/地点

```js
{
  id,
  regionId,
  latitude,
  longitude,
  type,
  name,
  summary,
  description,
  address,
  openingHours,
  ticket,
  duration,
  recommend,
  tips,
  tags,
  image
}
```

字段说明：

- `id`：地点唯一编号。
- `regionId`：关联 `regions.js` 中的区域 ID。
- `type`：当前统一为 `attraction`；具体美食已拆分至 `foods.js`。
- `latitude`、`longitude`：GCJ-02 数字坐标，用于微信原生地图 marker。
- `summary`：区域页短摘要。
- `description`：详情页多段介绍。
- `address`：地点地址。
- `openingHours`：开放或营业时间。
- `ticket`：门票或消费说明。
- `duration`：建议游览时间。
- `recommend`：推荐理由。
- `tips`：实用提醒数组。
- `tags`：标签数组。
- `image`：图片路径，目前为空字符串。

### 4.3 美食

```js
{
  id,
  regionId,
  latitude,
  longitude,
  type,
  name,
  shop,
  summary,
  description,
  address,
  price,
  recommend,
  tips,
  tags,
  image
}
```

美食集中保存在 `miniprogram/data/foods.js`。坐标为可选字段：只有能够确认固定推荐门店位置的数据才增加数字坐标，当前已有 2 条。

## 5. 当前页面流程

```text
首页 home
  ├── 点击区域卡片 → 区域攻略页 region?id=区域ID
  └── 点击地图 marker → 地点详情页 detail?id=地点ID

区域攻略页 region
  ├── places.js 按 regionId 筛选景点
  └── foods.js 按 regionId 筛选美食
```

详情页当前显示：

- 地点名称
- 短摘要
- 详细介绍
- 地址
- 推荐理由
- 标签
- 实用提醒

数据中已有但详情页暂未显示：

- `openingHours`
- `ticket`
- `duration`
- `image`

## 6. 当前主要文件结构

```text
xian-travel-guide/
├── .gitignore
├── README.md
├── docs/
│   ├── product.md
│   ├── content-plan.md
│   └── development-log-2026-07-19.md
└── miniprogram/
    ├── app.js
    ├── app.json
    ├── app.wxss
    ├── data/
    │   ├── regions.js
    │   ├── places.js
    │   └── foods.js
    └── pages/
        ├── home/
        ├── food/
        ├── region/
        ├── detail/
        └── index/
```

## 7. 当前已验证状态

- `regions.js` 包含 5 个区域。
- `places.js` 包含 13 个地点。
- `foods.js` 包含 9 条美食数据。
- 区域 ID 无重复。
- 地点 ID 无重复。
- 所有地点 `regionId` 都能找到对应区域。
- 所有地点均具有完整字段。
- 所有 `description` 都是非空字符串并包含 3 个段落。
- 所有 `tips` 和 `tags` 均为数组。
- 首页区域卡片由 `regions.js` 驱动。
- 首页使用微信原生 `map`，13 个 marker 均由 `places.js` 坐标生成。
- marker 包含地点名常显 callout，点击后能映射到稳定的地点 ID。
- 5 个区域都能生成正确跳转地址。
- 区域页能按区域分别筛选 `places.js` 景点和 `foods.js` 美食。
- 区域页酒店预留字段、筛选、展示区域及专用样式已全部删除。
- 详情页能按地点 ID 查找完整地点内容，并通过 `regions.js` 显示所属区域。
- 本地 Git 仓库有效，默认分支为 `main`。
- 本地 `main` 已连接并跟踪 GitHub 的 `origin/main`。
- 项目基础版本和 README 已成功上传到 GitHub。
- `miniprogram/project.private.config.json` 已被忽略，不会进入版本库。

## 8. 尚未完成和建议的下一步

### 优先级较高

1. 区域页顶部目前仍使用静态提示文字，建议改为显示 `{{region.summary}}`。
2. 详情页增加 `openingHours`、`ticket` 和 `duration` 展示。
3. 为无效区域 ID 和地点 ID 增加明确的“未找到内容”状态。
4. 在微信开发者工具和真机中检查长文、五张区域卡片和地图按钮布局。

### 后续功能

5. 创建三日行程数据和行程页面。
6. 准备正式西安示意地图和地点图片。
7. 图片接入前进行压缩并确认使用权限。
8. 增加基本页面分享能力。
9. 为具有固定推荐门店的美食逐步补充可靠的 GCJ-02 坐标。

### 可维护性优化

10. 后续开发美食详情和地图定位时，复用现有 ID 查询与原生地图数据流。
11. 正式地图需要地理位置时，可在区域数据中增加地图坐标字段。
12. 当前 5 色主题按数组顺序循环；若以后要求区域颜色永久固定，可将主题键加入区域数据。

## 9. 下次继续开发前建议读取

按以下顺序恢复项目上下文：

1. `docs/development-log-2026-07-19.md`
2. `docs/product.md`
3. `miniprogram/data/regions.js`
4. `miniprogram/data/places.js`
5. `miniprogram/data/foods.js`
6. 准备修改的具体页面文件

## 10. 给下一次协作的备注

- 用户是微信小程序初学者，修改前应先解释涉及文件、数据流和设计原因。
- 用户偏好分阶段开发，每次限制修改范围，不应越界修改其他页面。
- 修改完成后应说明验证结果和下一步建议。
- 旅游开放时间、票价和预约规则可能变化，发布或出发前应再次核对官方信息。
- Git 仓库已完成初始化并连接 GitHub；后续每完成一个独立阶段，应创建清晰的 Git 提交并推送到 `main`，或在功能较复杂时使用独立分支和 Pull Request。

## 11. 2026-07-20 阶段开发记录

### 11.1 美食数据与页面

- 新建 `miniprogram/data/foods.js`，录入 9 条西安美食。
- 美食 ID 使用无横杠英文格式，并通过 `regionId` 关联区域。
- 新建并注册 `pages/food/food`，支持通过 `regionId` 查询参数筛选；无参数时显示动态区域选择，不直接展示全部美食。
- 美食独立首页入口曾短暂接入，产品方向调整为“区域优先”后已从首页移除；food 页面和数据文件继续保留。
- 当前仅“肉夹馍+凉皮+冰峰（三件套）”与“葫芦鸡”具有已确认的 GCJ-02 数字坐标；冰峰等无固定或未确认门店坐标的数据不强行补录。

### 11.2 区域攻略成为核心入口

- `region.js` 同时读取 `regions.js`、`places.js`、`foods.js`。
- 当前区域 ID 分别驱动景点和美食筛选，页面不写死旅游数据。
- 美食卡片展示名称、推荐店铺、简介、价格和标签，暂不跳转详情。
- 回民街、洒金桥从 `food` 类型调整为 `attraction`，仍归属 `lianhu`；具体食物只保存在 `foods.js`。
- 产品暂时取消酒店模块；区域页的 `hotels` 数据字段、酒店筛选、完整 WXML 区块和酒店专用样式已删除。

### 11.3 首页原生地图与景点 marker

- 首页原地图占位区域替换为微信原生 `<map>` 组件。
- 默认中心为西安市中心：纬度 `34.341568`、经度 `108.940174`，缩放级别 `12`。
- `places.js` 的 13 个地点均增加 GCJ-02 数字坐标。
- 首页从 `places.js` 动态生成 marker，未在页面中手写坐标。
- 每个 marker 包含数字 ID、坐标、名称、`32×32` 尺寸，以及常显地点名称的 callout。
- 地图下方与“旅行区域”重复的区域快捷按钮已从 WXML 删除，原有区域卡片和跳转逻辑保留。

### 11.4 marker 到景点详情的数据流

```text
places.js
  ↓ 生成 markers 和 markerId → place.id 映射
首页 map 的 bindmarkertap
  ↓ goToPlaceDetail()
wx.navigateTo('/pages/detail/detail?id=place.id')
  ↓
detail.js 查询 places.js，并按 regionId 查询 regions.js
```

详情页在原有内容基础上增加“所属区域”，未引入图片、路线、酒店或第三方 API。

### 11.5 开发者工具提示

- 微信基础库曾提示 marker 必须提供 `width` 和 `height`，已通过为所有 marker 设置 `32` 修复。
- `subPageFrameEndTime of null`、`WAServiceMainContext.js timeout` 和 SharedArrayBuffer 提示来自微信开发者工具运行环境，项目代码中不存在对应字段。
- 若再次出现内部超时，优先更新开发者工具、关闭自动热重载、清除缓存并重启；不要为此修改业务代码。

### 11.6 下一阶段建议

建议继续按小步迭代推进：

1. 创建美食详情页，通过美食 ID 从 `foods.js` 查询。
2. 仅对具有有效坐标的美食显示“查看地图位置”。
3. 再建立统一地图页，使景点、美食以及未来的行程节点使用一致的地图数据结构。
4. 在微信开发者工具和真机中回归测试区域筛选、marker 点击和长文本布局。

### 11.7 本次阶段收尾状态

- 已在本地创建阶段分支 `agent/region-food-map` 并完成阶段提交。
- 已完成 JS、JSON、WXML、页面注册、数据关联、坐标类型和 Git diff 格式检查。
- 本次业务代码与交接文档已提交；`gpt-wed-dev/` 和微信开发者工具自动修改的 `miniprogram/project.config.json` 未纳入提交。
- 远端推送尚未完成：当前环境连接 `github.com:443` 超时，GitHub 连接器对仓库写操作返回 403。网络或授权恢复后，应先推送 `agent/region-food-map`，再创建指向 `main` 的 Pull Request。

# 第五部分：2026-07-22 景点官方预约功能

## 1. 本阶段范围

- 为 `places.js` 中全部 13 个景点补充预约信息。
- 在景点详情页增加预约状态、官方平台、操作说明、官方来源和核实日期。
- 根据渠道类型处理公众号名称复制、官方网址复制、无需预约和暂未确认状态。
- 保留原有参考位置、附近景点和微信地图导航功能。
- 不修改美食数据、README 和本机 `project.config.json`。

## 2. 预约数据结构

每个景点使用统一对象：

```js
reservation: {
  status,
  type,
  statusText,
  title,
  platform,
  appId,
  path,
  url,
  accountName,
  instructions,
  sourceName,
  sourceUrl,
  verifiedAt
}
```

字段原则：

- `status` 当前使用 `required`、`available`、`notRequired`、`unverified`。
- `type` 当前使用 `officialAccount`、`web`、`none`、`unverified`，代码保留经过严格校验的 `miniProgram` 处理分支。
- `appId` 和 `path` 未确认时保持空字符串，不猜测微信小程序参数。
- `sourceName`、`sourceUrl` 和 `verifiedAt` 用于追溯官方依据。
- 官方网页暂不通过 `web-view` 打开，只允许用户复制网址后自行访问。

## 3. 当前 13 个景点预约状态

| 景点 | 状态 | 渠道 |
| --- | --- | --- |
| 陕西历史博物馆 | 需提前预约 | 微信公众号“陕西历史博物馆” |
| 大雁塔·大慈恩寺 | 暂未确认 | 暂未找到可靠官方入口 |
| 大唐不夜城 | 无需预约 | 开放式步行街 |
| 大唐芙蓉园 | 官方渠道可查询 | 微信公众号“大唐芙蓉园” |
| 西安城墙 | 官方渠道可查询 | 微信公众号“遇见城墙” |
| 西安碑林博物馆 | 需实名预约购票 | 官方网站 |
| 书院门文化街 | 无需预约 | 公共历史文化街区 |
| 西安钟楼 | 暂未确认 | 当前官方入口未可靠确认 |
| 西安鼓楼 | 暂未确认 | 当前官方入口未可靠确认 |
| 回民街 | 无需预约 | 公共历史文化街区 |
| 洒金桥 | 无需预约 | 公共历史文化街区 |
| 秦始皇兵马俑博物馆 | 需实名预约参观 | 秦始皇帝陵博物院官方网站 |
| 华清宫 | 官方渠道可查询 | 微信公众号“华清宫景区” |

街区级“无需预约”只表示街区整体无需预约，其中的独立场馆、演出和经营项目仍按各自规则执行。

## 4. 页面交互

- `detail.wxml` 在游览信息下方增加预约卡片。
- `detail.js` 根据预约类型决定是否显示操作按钮。
- 公众号入口使用 `wx.showModal` 展示名称，确认后通过 `wx.setClipboardData` 复制。
- 官方网页入口在弹窗中说明业务域名限制，确认后复制网址。
- 用户取消弹窗时不执行复制。
- 复制或弹窗失败时通过 `wx.showToast` 显示错误提示。
- reservation 缺失时预约卡片不显示；关键操作字段为空时按钮不显示，直接调用处理函数也会安全退出。

## 5. 静态验证与复查

已完成：

- `places.js` 和 `detail.js` JavaScript 语法检查。
- 13 个景点预约对象、字段、状态、来源和核实日期检查。
- WXML 标签配对与 WXSS 大括号检查。
- 公众号和网页复制成功、复制失败、取消及弹窗失败分支模拟。
- reservation 缺失和关键字段不完整的安全降级模拟。
- 原有地图导航调用检查。

仍需微信开发者工具或真机验证：

- 公众号名称复制和微信搜索结果。
- 官方网址复制及浏览器访问。
- 弹窗长文本、状态标签和小屏页面布局。
- `wx.setClipboardData` 的真实成功与失败表现。
- “查看参考位置”“打开地图导航”和返回上一级页面。
- 13 个景点逐一打开后的完整冒烟测试。

## 6. 已知非阻断性问题

- 预约按钮当前没有防重复点击锁，极快连点需要在真机观察是否出现连续弹窗。
- `hasReservationAction` 依据渠道类型和入口参数判断，不额外校验预约状态；当前数据组合正确，未来维护时应避免状态与类型矛盾。
- reservation 对象若缺少非操作型展示字段，页面不会报错，但可能显示空白文字；当前 13 条数据字段完整。

## 7. 阶段收尾状态

- 预约功能代码、官方来源记录和文档已完成复查。
- 预约功能与同日美食图片改动统一纳入 2026-07-22 阶段收尾。

# 第六部分：2026-07-22 美食 JPG 图片接入

## 1. 本阶段范围

- 为 `foods.js` 中 9 条美食配置本地 JPG 封面和详情轮播图片。
- 在区域页和美食列表展示封面图。
- 在美食详情页保留 swiper、指示点、`aspectFill` 和空图片占位，并支持点击全屏预览。
- 不修改景点图片、地图、坐标、预约信息和页面整体布局。

## 2. 图片目录与数据结构

- 图片统一位于 `miniprogram/images/foods/<food-id>/`。
- 9 个图片目录与 9 条美食 ID 一一对应。
- 共 19 张 JPG：8 条美食各 2 张，`biangbiangmian` 3 张。
- `image` 指向 `cover.jpg`，供区域页和美食列表使用。
- `images` 保存详情轮播数组，第一张同样为 `cover.jpg`。
- `yangroupaomo` 目录只有 `cover.jpg` 和 `detail-1.jpg`，未保留不存在的 `detail-2` 引用。

## 3. 页面交互

- `region.wxml` 和 `food.wxml` 继续使用原有数据绑定及 `mode="aspectFill"`。
- `food-detail.wxml` 使用 swiper 展示图片组并保留指示点。
- 图片通过 `data-src` 和 `bindtap="previewImage"` 进入微信全屏预览。
- 图片数组为空时继续显示原有占位状态。
- JPG 图片组件不再设置 `webp="{{true}}"`。

## 4. 静态验证

- 项目内未发现残留 `.webp` 图片引用或 `webp=` 属性。
- `foods.js` 中 28 个 JPG 路径字面引用对应 19 个唯一文件。
- 缺失路径、大小写错误和未引用 JPG 均为 0。
- 19 张 JPG 全部非空、格式正确且可以正常解码。
- `project.config.json` 未通过 `packOptions` 排除图片目录或 JPG。
- `foods.js` JavaScript 语法检查和 Git diff 格式检查通过。

## 5. 后续复测

- 在微信开发者工具清除缓存并重新编译，逐一检查 9 条美食的列表封面和详情轮播。
- 重点确认 `biangbiangmian` 显示 3 张图片、其余美食显示 2 张图片。
- 在 iPhone 真机检查轮播、指示点、全屏预览、返回流程和图片加载错误。

# 第七部分：2026-07-23 区域交互与实时搜索

## 1. 本阶段范围

- 将区域页景点、美食列表改为手风琴交互。
- 将首页和区域页搜索改为当前页面内嵌实时联想。
- 新增公共搜索工具，统一首页、区域页和保留的独立搜索页的匹配规则。
- 保留原有地图、marker、定位、详情页、预约、导航和美食图片功能。
- 不修改 `regions.js`、`places.js`、`foods.js` 的内容结构。

## 2. 区域页手风琴

- `region.js` 使用 `activeSection` 保存当前展开分类。
- 初始值为空字符串，因此进入区域页时景点和美食均处于收起状态。
- 点击景点时设置为 `attractions`，点击美食时设置为 `foods`。
- 两个分类互斥展开；再次点击当前分类时恢复为空字符串并收起。
- 景点、美食的原有数据筛选、卡片内容、图片和详情地址保持不变。

## 3. 公共搜索工具

- 新增 `miniprogram/utils/search-utils.js`。
- `buildSearchSuggestions()` 接收景点数组、美食数组、关键词和结果上限。
- 第一版只匹配 `name` 字段，关键词会去除首尾空格并转为小写。
- 名称开头匹配优先，其他包含匹配其次，默认及当前调用上限均为 5 条。
- 返回结果统一包含 `id`、`kind`、`icon`、`typeLabel`、`name` 和 `url`。
- 景点地址为 `/pages/detail/detail?id=...`，美食地址为 `/pages/food-detail/food-detail?id=...`。

## 4. 首页内嵌搜索

- 搜索入口位于首页原生地图下方、区域入口上方。
- 点击入口后在首页原地切换为输入框，并请求自动聚焦。
- `bindinput` 每次输入时调用公共搜索工具，半透明面板实时展示联想结果。
- 点击取消时关闭输入状态并清空关键词和结果。
- 首页搜索传入全部 `places.js` 和 `foods.js` 数据，不改变地图及 marker 数据流。
- 首页已移除跳转 `/pages/search/search` 的入口。

## 5. 区域页内嵌搜索

- 搜索入口位于区域介绍下方、景点和美食分类上方。
- 点击后在区域页原地展开输入框、取消按钮和半透明联想面板。
- 搜索只传入 `this.data.attractions` 与 `this.data.foods`，因此范围严格限制为当前 `regionId`。
- 点击结果时先清空并关闭搜索状态，再通过 `wx.navigateTo` 进入对应详情。
- 搜索状态不读取或修改 `activeSection`，不会影响手风琴展开状态。
- 区域页已移除跳转 `/pages/search/search?regionId=...` 的入口。

## 6. 独立搜索页状态

- `pages/search` 继续保留并在 `app.json` 中注册。
- 页面继续支持全局与按 `regionId` 过滤的数据源，并已改为复用 `search-utils.js`。
- 当前首页和区域页都使用内嵌搜索，没有常规入口跳转到独立搜索页。
- 未增加搜索历史、热门搜索、拼音搜索、云数据库或复杂排序。

## 7. 静态验证与后续复测

已完成：

- `home.js`、`region.js`、`search.js` 和 `search-utils.js` JavaScript 语法检查。
- 公共搜索工具的前缀优先、包含匹配、空关键词和最多 5 条结果模拟。
- 首页搜索展开、取消、实时结果和无结果状态模拟。
- 雁塔区搜索“大雁”“肉夹馍”的命中，以及“兵马俑”不命中的区域隔离模拟。
- 区域搜索关闭后详情跳转和手风琴状态保持模拟。
- 相关 WXML 标签结构、WXSS 大括号及 Git diff 格式检查。

仍需微信开发者工具与真机验证：

- 首页和区域页输入框自动聚焦及中文输入法组合输入。
- 键盘遮挡、取消搜索、删除关键词、无结果和最多 5 条提示的视觉表现。
- 点击联想结果、进入详情、返回后的页面状态。
- 搜索展开时地图操作和区域手风琴点击是否保持顺畅。
