window.sampleBundle = {
  claim: {
    title: "Solar Classroom DAO Nairobi delivery review",
    question:
      "Did Solar Classroom DAO run six community workshops and deliver roughly 180 refurbished devices across two schools in Nairobi during February 2026?"
  },
  recommendation: {
    outcome: "provisionally-verified"
  },
  consensus: {
    verdict: "support",
    consensusRatio: 0.75
  },
  evidenceCoverage: 0.75,
  identityRequirements: {
    provider: "Self Agent ID",
    minimumAge: 18,
    ofac: true,
    nationalityDisclosure: true
  },
  quorum: {
    acceptedWitnesses: 4,
    requiredWitnesses: 3,
    rejectedWitnesses: 1,
    quorumReached: true
  },
  acceptedWitnesses: [
    {
      witnessAlias: "witness-ke-1c2a",
      role: "local educator",
      verdict: "support",
      confidence: 0.92,
      statement:
        "I attended four of the six workshops directly and saw the final delivery batch arrive. My estimate is roughly 176 devices across both schools."
    },
    {
      witnessAlias: "witness-ke-7d41",
      role: "volunteer coordinator",
      verdict: "support",
      confidence: 0.88,
      statement:
        "The project definitely ran six workshops. Our logistics sheet recorded 180 devices earmarked for the two schools."
    },
    {
      witnessAlias: "witness-ke-5f90",
      role: "school operations partner",
      verdict: "partial",
      confidence: 0.74,
      statement:
        "The workshops happened, but the second school received the last equipment later than the public post suggested."
    },
    {
      witnessAlias: "witness-ke-22ab",
      role: "community witness",
      verdict: "support",
      confidence: 0.81,
      statement:
        "I cannot verify the exact count, but the program clearly happened and both schools were involved."
    }
  ],
  divergences: [
    {
      key: "devices",
      values: ["176", "180", "160", "unknown"]
    },
    {
      key: "school-b",
      values: ["delivered", "late"]
    }
  ],
  nextQuestions: [
    "Resolve divergence on Devices: 176, 180, 160, unknown.",
    "Resolve divergence on School B: delivered, late."
  ]
};
