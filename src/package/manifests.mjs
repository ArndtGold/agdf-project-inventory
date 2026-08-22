export function renderCodexManifest(definition) {
  return {
    name: definition.id,
    version: definition.version,
    description: definition.description,
    author: { name: "Arndt Gold", url: definition.homepage },
    homepage: definition.homepage,
    repository: definition.repository,
    license: definition.license,
    skills: "./skills/",
    interface: {
      displayName: definition.display_name,
      shortDescription: definition.description,
      longDescription: definition.long_description,
      defaultPrompt: definition.default_prompt,
      developerName: "Arndt Gold",
      category: "Productivity",
      capabilities: ["Read", "Write"],
      websiteURL: definition.homepage
    }
  };
}

export function renderClaudeManifest(definition) {
  return {
    name: definition.id,
    version: definition.version,
    description: definition.description,
    author: { name: "Arndt Gold", url: definition.homepage },
    repository: definition.repository,
    license: definition.license
  };
}
