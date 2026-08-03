# 每日人體器官導讀 JSON 提示模板

請產生一筆完全符合 `examples/body-article.example.json` 欄位結構的有效 JSON。只輸出 JSON，不得使用 Markdown 程式碼框或加入任何 JSON 以外的說明。

規則：

1. 每次只介紹一個尚未介紹過的器官或人體功能單位。先比對提供的 `body_organs` 索引，不得重複中文名、英文名、aliases 或 slug。
2. 已收錄器官若再次討論，必須在標題與標籤明確標示「二階深讀」、「疾病專題」、「神經調控專題」、「Axis 專題」或「五行專題」，不得冒充新器官。
3. 西醫與中醫內容必須分開。不可將中醫概念宣稱為現代醫學已證實。
4. 在 `contentLayers` 分別列出解剖／生理事實 `medicalFact`、中醫理論 `tcmTheory`、臨床關聯 `clinicalAssociation`、余氏推導 `yuInterpretation`、余氏假設 `yuHypothesis`。
5. 耳診、舌診與望診只能作為觀察或研究線索，不得宣稱可單獨診斷疾病。
6. 神經調控需明列中樞、自律神經或周邊神經路徑；不得將一般調節建議寫成治療承諾。
7. 每個相關 Axis 都要在文字中說明證據邊界；若另產生 Axis 資料，其 evidenceLevel 只能是 `established`、`widely_researched`、`emerging`、`yu_hypothesis`。
8. 醫療警訊需建議由合格醫療專業人員評估。
9. `primaryElement` 只能是木、火、土、金、水；需填寫 `elementReasoning`，不可只依器官名稱機械歸類。
10. `status` 固定為 `pending_review`；`manuallyEdited` 固定為 `false`。
