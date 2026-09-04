/**
 * JSON-LD 구조화 데이터 삽입기.
 *
 * 답변 엔진과 생성형 검색은 본문 파싱보다 구조화 데이터를 우선 신뢰한다.
 * 서버 컴포넌트이므로 스크립트가 HTML에 그대로 실려 나가 크롤러가 JS 실행 없이 읽는다.
 */

interface JsonLdProps {
  /** schema.org 객체. 배열을 주면 @graph로 묶지 않고 각각 별도 스크립트로 낸다 */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * `</script>`가 문자열 값에 들어오면 스크립트 블록이 조기 종료되어
 * 뒤따르는 내용이 마크업으로 해석된다. 유니코드 이스케이프로 막는다.
 */
function serialize(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export default function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item) => (
        <script
          key={serialize(item['@type'] ?? item['@id'] ?? item)}
          type='application/ld+json'
          // 구조화 데이터는 우리가 만든 객체만 직렬화하며, 위 serialize가 </script>를 무력화한다
          dangerouslySetInnerHTML={{ __html: serialize(item) }}
        />
      ))}
    </>
  );
}
