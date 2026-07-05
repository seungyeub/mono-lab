import { nextJsConfig } from '@repo/eslint-config/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    rules: {
      'react/no-unknown-property': 'off', /*
      🚨 원래 이 규칙(no-unknown-property)의 역할
        React를 쓸 때 <div class="box"> 처럼 className을 써야 할 곳에 실수로 HTML 문법인 class를 쓰거나, onclick을 소문자로 적었을 때 "이거 리액트 속성 아닌데요?" 하고 잡아주는 아주 유용한 규칙입니다. 이걸 끄("off")게 되면, ESLint는 저런 기초적인 오타를 잡아주지 않고 눈감아 버립니다.
      🛡️ 끄더라도 전혀 문제가 없는 이유 (우리의 무기)
        우리는 자바스크립트가 아니라 TypeScript를 쓰고 있기 때문입니다! ESLint가 감시를 포기하더라도, TypeScript가 훨씬 더 강력한 문지기 역할을 해줍니다.

        만약 승엽님이 일반 <div> 태그에 실수로 이상한 속성을 적으면, ESLint는 넘어가더라도 IDE(VSCode) 화면 전체에 뻘겋게 밑줄이 그어지며 "div에는 해당 속성이 없습니다" 라고 TypeScript 에러가 뜹니다. 당연히 CI 파이프라인의 Type Check 단계에서도 걸러집니다.
      💡 만약 그래도 찝찝하시다면? (대안)
        아예 다 꺼버리는 것이 싫으시다면, "특정 단어들만 에러 안 나게 봐줘" 라고 콕 집어서 예외 처리를 할 수도 있습니다.
      */
    },
  },
];
