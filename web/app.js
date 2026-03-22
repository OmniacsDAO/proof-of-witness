const bundle = window.sampleBundle;

document.getElementById("claim-title").textContent = bundle.claim.title;
document.getElementById("claim-question").textContent = bundle.claim.question;
document.getElementById("recommendation").textContent = bundle.recommendation.outcome;
document.getElementById("consensus").textContent = `${bundle.consensus.verdict} (${bundle.consensus.consensusRatio})`;
document.getElementById("evidence").textContent = bundle.evidenceCoverage;

const identityRules = document.getElementById("identity-rules");
[
  `${bundle.identityRequirements.provider} required for counted witnesses`,
  `Minimum age: ${bundle.identityRequirements.minimumAge}+`,
  `OFAC screening: ${bundle.identityRequirements.ofac ? "enabled" : "disabled"}`,
  `Nationality disclosure: ${bundle.identityRequirements.nationalityDisclosure ? "requested" : "not requested"}`
].forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  identityRules.appendChild(li);
});

document.getElementById("quorum-card").innerHTML = `
  <strong>${bundle.quorum.acceptedWitnesses}/${bundle.quorum.requiredWitnesses} required witnesses accepted</strong>
  <p>Rejected responses: ${bundle.quorum.rejectedWitnesses}. Quorum reached: ${bundle.quorum.quorumReached ? "yes" : "no"}.</p>
`;

const witnesses = document.getElementById("witnesses");
bundle.acceptedWitnesses.forEach((item) => {
  const card = document.createElement("section");
  card.className = "witness";
  card.innerHTML = `
    <header>
      <strong>${item.witnessAlias}</strong>
      <span class="badge">${item.verdict}</span>
    </header>
    <p><strong>${item.role}</strong> · confidence ${item.confidence}</p>
    <p>${item.statement}</p>
  `;
  witnesses.appendChild(card);
});

const divergences = document.getElementById("divergences");
bundle.divergences.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = `${item.key}: ${item.values.join(", ")}`;
  divergences.appendChild(li);
});

const nextQuestions = document.getElementById("next-questions");
bundle.nextQuestions.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  nextQuestions.appendChild(li);
});
