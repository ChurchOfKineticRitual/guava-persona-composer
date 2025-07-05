export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  edited?: boolean;
  selected?: 'active' | 'inactive' | 'partial';
}

// Simulate reading from GitHub repo - in a real implementation this would fetch from GitHub API
export const getPersonaStructure = async (personaId: string, version: string): Promise<FileNode[]> => {
  // This would normally fetch from GitHub API, but for now we'll build it from the known structure
  const basePath = `/personas/${personaId}/versions/${version}`;
  
  try {
    // Build the complete file structure dynamically
    const structure: FileNode[] = [
      {
        name: "agents",
        type: "folder",
        path: `${basePath}/agents`,
        selected: "active",
        children: [
          {
            name: "critic",
            type: "folder",
            path: `${basePath}/agents/critic`,
            selected: "active",
            children: [
              { name: "persona_data.xml", type: "file", path: `${basePath}/agents/critic/persona_data.xml`, selected: "active" },
              { name: "system_prompt.md", type: "file", path: `${basePath}/agents/critic/system_prompt.md`, selected: "active" }
            ]
          },
          {
            name: "researcher",
            type: "folder", 
            path: `${basePath}/agents/researcher`,
            selected: "active",
            children: [
              { name: "persona_data.xml", type: "file", path: `${basePath}/agents/researcher/persona_data.xml`, selected: "active" },
              { name: "system_prompt.md", type: "file", path: `${basePath}/agents/researcher/system_prompt.md`, selected: "active" }
            ]
          },
          {
            name: "studio",
            type: "folder",
            path: `${basePath}/agents/studio`,
            selected: "active",
            children: [
              { name: "persona_data.xml", type: "file", path: `${basePath}/agents/studio/persona_data.xml`, selected: "active" },
              { name: "system_prompt.md", type: "file", path: `${basePath}/agents/studio/system_prompt.md`, selected: "active" }
            ]
          },
          {
            name: "voice",
            type: "folder",
            path: `${basePath}/agents/voice`,
            selected: "active",
            children: [
              { name: "persona_data.xml", type: "file", path: `${basePath}/agents/voice/persona_data.xml`, selected: "active" },
              { name: "system_prompt.md", type: "file", path: `${basePath}/agents/voice/system_prompt.md`, selected: "active", edited: true }
            ]
          },
          {
            name: "writer",
            type: "folder",
            path: `${basePath}/agents/writer`,
            selected: "active",
            children: [
              { name: "persona_data.xml", type: "file", path: `${basePath}/agents/writer/persona_data.xml`, selected: "active" },
              { name: "system_prompt.md", type: "file", path: `${basePath}/agents/writer/system_prompt.md`, selected: "active" }
            ]
          }
        ]
      },
      {
        name: "config",
        type: "folder",
        path: `${basePath}/config`,
        selected: "active",
        children: [
          { name: "kontextbase_map.xml", type: "file", path: `${basePath}/config/kontextbase_map.xml`, selected: "active" },
          { name: "register_selection_guide.xml", type: "file", path: `${basePath}/config/register_selection_guide.xml`, selected: "active" }
        ]
      },
      {
        name: "content_examples",
        type: "folder",
        path: `${basePath}/content_examples`,
        selected: "active",
        children: [
          {
            name: "spoken",
            type: "folder",
            path: `${basePath}/content_examples/spoken`,
            selected: "active",
            children: [
              { name: "core_principles.xml", type: "file", path: `${basePath}/content_examples/spoken/core_principles.xml`, selected: "active" },
              { name: "qna_examples.xml", type: "file", path: `${basePath}/content_examples/spoken/qna_examples.xml`, selected: "active" },
              { name: "target_ckr02.xml", type: "file", path: `${basePath}/content_examples/spoken/target_ckr02.xml`, selected: "active" },
              { name: "target_dearmrc.xml", type: "file", path: `${basePath}/content_examples/spoken/target_dearmrc.xml`, selected: "active" }
            ]
          },
          {
            name: "written",
            type: "folder",
            path: `${basePath}/content_examples/written`,
            selected: "active",
            children: [
              { name: "core_principles.xml", type: "file", path: `${basePath}/content_examples/written/core_principles.xml`, selected: "active" },
              { name: "qna_examples.xml", type: "file", path: `${basePath}/content_examples/written/qna_examples.xml`, selected: "active" },
              { name: "target_webstore.xml", type: "file", path: `${basePath}/content_examples/written/target_webstore.xml`, selected: "active" }
            ]
          }
        ]
      },
      {
        name: "data",
        type: "folder",
        path: `${basePath}/data`,
        selected: "active",
        children: [
          { name: "canonical_entities.xml", type: "file", path: `${basePath}/data/canonical_entities.xml`, selected: "active" },
          { name: "codex_summary.xml", type: "file", path: `${basePath}/data/codex_summary.xml`, selected: "active" },
          { name: "proprietary_lexicon.xml", type: "file", path: `${basePath}/data/proprietary_lexicon.xml`, selected: "active" },
          {
            name: "lore",
            type: "folder",
            path: `${basePath}/data/lore`,
            selected: "active",
            children: [
              { name: "codex_kinesis_full.md", type: "file", path: `${basePath}/data/lore/codex_kinesis_full.md`, selected: "active" },
              { name: "original_sources_archive.md", type: "file", path: `${basePath}/data/lore/original_sources_archive.md`, selected: "active" },
              { name: "terminology_reference_source.md", type: "file", path: `${basePath}/data/lore/terminology_reference_source.md`, selected: "active" }
            ]
          }
        ]
      },
      {
        name: "definition",
        type: "folder",
        path: `${basePath}/definition`,
        selected: "active",
        children: [
          { name: "development_log.md", type: "file", path: `${basePath}/definition/development_log.md`, selected: "active" },
          { name: "fine_tuning_log.md", type: "file", path: `${basePath}/definition/fine_tuning_log.md`, selected: "active" },
          { name: "persona_spec.md", type: "file", path: `${basePath}/definition/persona_spec.md`, selected: "active" }
        ]
      }
    ];

    return structure;
  } catch (error) {
    console.error('Error loading persona structure:', error);
    return [];
  }
};

export const getAvailablePersonas = async (): Promise<string[]> => {
  // In a real implementation, this would scan the /personas directory
  return ['klark_kent'];
};

export const getPersonaVersions = async (personaId: string): Promise<string[]> => {
  // In a real implementation, this would scan the /personas/{personaId}/versions directory
  return ['INITIAL'];
};

export const getPersonaMetadata = async (personaId: string, version: string) => {
  // In a real implementation, this would parse metadata from actual files
  return {
    voiceId: "YOUR_ELEVENLABS_VOICE_ID_HERE",
    image: "KK_Shrinkface_M.png",
    persona: personaId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    version: version
  };
};