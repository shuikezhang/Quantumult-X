// 转自 @suiyuran
let url = $request.url;

// 判断是否包含 uid 参数的函数
let hasUid = (url) => url.includes("uid");

// 获取 uid 的函数
let getUid = (url) => (hasUid(url) ? url.match(/uid=(\d+)/)[1] : undefined);

if (url.includes("users/show")) {
  // 写入 uid
  $prefs.setValueForKey(getUid(url), "uid");
  $done({});
} else if (url.includes("statuses/user_timeline")) {
  let uid = getUid(url) || $prefs.valueForKey("uid");
  url = url.replace("statuses/user_timeline", "profile/statuses/tab").replace("max_id", "since_id");
  url = url + `&containerid=230413${uid}_-_WEIBO_SECOND_PROFILE_WEIBO`;
  $done({ url });
} else if (url.includes("profile/statuses/tab")) {
  let data = JSON.parse($response.body);
  let statuses = data.cards
    .map((card) => (card.card_group ? card.card_group : card))
    .flat()
    .filter((card) => card.card_type === 9)
    .map((card) => card.mblog);
  let sinceId = data.cardlistInfo.since_id;
  $done({ body: JSON.stringify({ statuses, since_id: sinceId, total_number: 100 }) });
} else {
  $done({});
}
