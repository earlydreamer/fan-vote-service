export function NotFoundPage() {
  return (
    <section className="content-panel not-found" aria-labelledby="not-found-title">
      <p className="eyebrow">Route fallback</p>
      <h1 id="not-found-title">페이지를 찾을 수 없어요</h1>
      <p>투표방 주소가 바뀌었거나 아직 만들어지지 않은 화면이에요.</p>
      <a className="button button-primary" href="/">
        홈으로 돌아가기
      </a>
    </section>
  );
}
