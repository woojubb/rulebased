# 🤖 RuleBased MCP Commands Development Plan

## 📋 Overview

This document outlines the planned MCP commands to enable AI agents to freely read, write, and update rules using natural language prompts. The goal is to make rule management seamless and intuitive for AI-driven development workflows.

## 🎯 Core Requirements

- **Natural Language Interface**: AI can request rule operations using natural language
- **Efficient Partial Loading**: Rules can be loaded partially for better performance
- **Prompt-driven Management**: Complete rule lifecycle management through prompts only
- **Context Awareness**: Commands should understand project context and rule structure

## 📊 Current State Analysis

### Existing MCP Tools
- `getRules`: Search rules by keywords
- `syncRules`: Synchronize rule sources
- `initProject`: Initialize project configuration

### Limitations
- No rule creation/modification capabilities
- No granular rule management
- Limited search and filtering options
- No metadata management

## 🛠️ Planned MCP Commands

### 1. Rule Creation & Management

#### `createRule`
**Purpose**: Create a new rule file or add rules to existing files (with duplicate prevention)
**Parameters**:
- `filename` (string): Name of the rule file (e.g., "typescript-style.md")
- `title` (string): Rule title/heading
- `content` (string): Rule content in markdown format
- `category` (string, optional): Rule category/tag
- `description` (string, optional): Brief description
- `source` (string, optional): Target source name (defaults to "default")
- `checkDuplicates` (boolean, optional): Check for similar existing rules (default: true)
- `mergeIfSimilar` (boolean, optional): Merge with similar rule if found (default: false)

**Example Usage**:
```
"Create a new TypeScript style rule that enforces using const for variables that don't change"
```

**Behavior**:
- First checks for similar existing rules using semantic similarity
- If similar rule found and `mergeIfSimilar` is true, updates existing rule
- If similar rule found and `mergeIfSimilar` is false, asks for confirmation
- Always ensures proper file structure and metadata

#### `updateRule`
**Purpose**: Update existing rule content
**Parameters**:
- `filename` (string): Target rule file
- `section` (string, optional): Specific section to update (if not provided, updates entire file)
- `content` (string): New content
- `operation` (enum): "replace", "append", "prepend"
- `searchText` (string, optional): Text to find for replacement

**Example Usage**:
```
"Update the git commit rule to include conventional commit format requirements"
```

#### `deleteRule`
**Purpose**: Delete rules or rule sections
**Parameters**:
- `filename` (string): Target rule file
- `section` (string, optional): Specific section to delete
- `confirm` (boolean): Confirmation flag

**Example Usage**:
```
"Delete the outdated React class component rules"
```

### 2. Enhanced Rule Retrieval

#### `listRules`
**Purpose**: List available rules with metadata
**Parameters**:
- `source` (string, optional): Filter by source
- `category` (string, optional): Filter by category
- `format` (enum): "summary", "detailed", "json"
- `includeMetadata` (boolean, optional): Include file stats, last modified, etc.

**Example Usage**:
```
"Show me all available TypeScript rules"
```

#### `getRuleDetails`
**Purpose**: Get detailed information about a specific rule
**Parameters**:
- `filename` (string): Rule file name
- `section` (string, optional): Specific section
- `includeMetadata` (boolean, optional): Include metadata
- `format` (enum): "markdown", "json", "plain"

**Example Usage**:
```
"Get the full content of the API design rules"
```

#### `searchRulesAdvanced`
**Purpose**: Advanced rule searching with multiple criteria
**Parameters**:
- `query` (string): Search query
- `sources` (array, optional): Specific sources to search
- `categories` (array, optional): Categories to include
- `excludeCategories` (array, optional): Categories to exclude
- `matchType` (enum): "exact", "fuzzy", "semantic"
- `limit` (number, optional): Maximum results
- `format` (enum): "markdown", "json", "summary"

**Example Usage**:
```
"Find all rules related to code review and testing, but exclude deprecated ones"
```

### 3. Rule Organization & Metadata

#### `categorizeRule`
**Purpose**: Add or update rule categories and tags
**Parameters**:
- `filename` (string): Target rule file
- `categories` (array): Categories to assign
- `tags` (array, optional): Additional tags
- `description` (string, optional): Update description

**Example Usage**:
```
"Categorize the new authentication rules under 'security' and 'backend'"
```

#### `getRuleMetadata`
**Purpose**: Get metadata about rules and sources
**Parameters**:
- `type` (enum): "sources", "categories", "stats", "recent"
- `source` (string, optional): Specific source
- `format` (enum): "json", "summary"

**Example Usage**:
```
"Show me statistics about rule usage and recent changes"
```

### 4. Rule Validation & Quality

#### `validateRule`
**Purpose**: Validate rule content and structure
**Parameters**:
- `filename` (string): Rule file to validate
- `checkFormat` (boolean, optional): Check markdown format
- `checkReferences` (boolean, optional): Check internal references
- `suggest` (boolean, optional): Suggest improvements

**Example Usage**:
```
"Validate the new database design rules and suggest improvements"
```

#### `formatRule`
**Purpose**: Format and standardize rule content
**Parameters**:
- `filename` (string): Target rule file
- `style` (string, optional): Formatting style preset
- `fixLinks` (boolean, optional): Fix broken links
- `standardizeHeaders` (boolean, optional): Standardize header levels

**Example Usage**:
```
"Format the API documentation rules to follow our standard structure"
```

### 5. Rule Repository Management

#### `indexRules`
**Purpose**: Build or rebuild the in-memory rule repository index
**Parameters**:
- `force` (boolean, optional): Force complete reindexing
- `sources` (array, optional): Specific sources to index
- `includeMetadata` (boolean, optional): Include detailed metadata

**Example Usage**:
```
"Rebuild the rule index to include the new security guidelines"
```

#### `findSimilarRules`
**Purpose**: Find rules similar to given content to prevent duplicates
**Parameters**:
- `content` (string): Content to check for similarity
- `threshold` (number, optional): Similarity threshold (0.0-1.0)
- `excludeFiles` (array, optional): Files to exclude from comparison
- `format` (enum): "summary", "detailed", "json"

**Example Usage**:
```
"Check if there are existing rules similar to this TypeScript configuration before creating a new one"
```

#### `mergeRules`
**Purpose**: Merge duplicate or similar rules intelligently
**Parameters**:
- `sourceFile` (string): Source rule file
- `targetFile` (string): Target rule file to merge into
- `strategy` (enum): "append", "replace", "smart-merge"
- `preserveHistory` (boolean, optional): Keep backup of original

**Example Usage**:
```
"Merge the duplicate React hooks rules into the main React guidelines"
```

#### `reorganizeRules`
**Purpose**: Reorganize rules according to category structure
**Parameters**:
- `dryRun` (boolean, optional): Preview reorganization without applying
- `strategy` (string, optional): Reorganization strategy
- `preserveOriginal` (boolean, optional): Keep original files as backup

**Example Usage**:
```
"Reorganize all rules into proper category folders based on their metadata"
```

### 6. Bulk Operations

#### `bulkUpdateRules`
**Purpose**: Apply updates to multiple rules at once
**Parameters**:
- `pattern` (string): File pattern or search criteria
- `operation` (string): Operation to perform
- `parameters` (object): Operation-specific parameters
- `dryRun` (boolean, optional): Preview changes without applying

**Example Usage**:
```
"Update all frontend rules to replace 'React 17' with 'React 18' patterns"
```

#### `exportRules`
**Purpose**: Export rules in various formats
**Parameters**:
- `sources` (array, optional): Sources to export
- `format` (enum): "markdown", "json", "html", "pdf"
- `includeMetadata` (boolean, optional): Include metadata
- `outputPath` (string, optional): Export destination

**Example Usage**:
```
"Export all security rules as a PDF for the team review"
```

## 🏗️ Implementation Strategy

### Phase 0: Foundation - Rule Repository Architecture
1. **RuleRepository Class**: In-memory rule management system
2. **Rule Parser**: Markdown + YAML frontmatter parsing
3. **Similarity Engine**: Content similarity detection for duplicates
4. **File System Watcher**: Real-time rule change detection
5. **Indexing System**: Search indexes for efficient querying

### Phase 1: Core CRUD Operations with Intelligent Management
1. `indexRules` - Build memory repository and indexes
2. `createRule` - Smart rule creation with duplicate prevention
3. `updateRule` - Rule modification with conflict detection
4. `deleteRule` - Safe deletion with dependency checking
5. `findSimilarRules` - Duplicate detection system

### Phase 2: Advanced Search & Organization
1. `listRules` with metadata and filtering
2. `searchRulesAdvanced` with semantic search
3. `categorizeRule` for organization
4. `getRuleMetadata` for insights
5. `mergeRules` - Intelligent rule merging

### Phase 3: Repository Management & Quality
1. `validateRule` for quality assurance
2. `formatRule` for standardization
3. `reorganizeRules` - Automatic categorization
4. `bulkUpdateRules` for efficiency
5. `exportRules` for sharing

### Phase 4: AI-Friendly Enhancements
1. Enhanced semantic search with embeddings
2. Natural language rule generation
3. Automatic categorization with ML
4. Rule relationship mapping and suggestions

## 🏗️ Rule Structure & Memory Management

### Rule Normalization & Storage
- **Structured Rule Format**: All rules follow consistent markdown structure with frontmatter metadata
- **Standardized File Naming**: Kebab-case naming convention (e.g., `typescript-style-guide.md`)
- **Folder Organization**: Hierarchical categorization (`frontend/`, `backend/`, `security/`, etc.)
- **Metadata Headers**: YAML frontmatter for categories, tags, version, last-modified, etc.

**Example Rule Structure**:
```markdown
---
title: "TypeScript Style Guide"
categories: ["frontend", "typescript", "style"]
tags: ["const", "variables", "immutability"]
description: "Rules for TypeScript variable declarations"
version: "1.0"
lastModified: "2024-01-15T10:30:00Z"
author: "team"
relatedRules: ["javascript-style-guide.md"]
---

# TypeScript Style Guide

## Variable Declarations

### Use const for immutable values
Always use `const` for variables that don't change after declaration.

**Good:**
```typescript
const API_URL = 'https://api.example.com';
const userConfig = { theme: 'dark' };
```

**Bad:**
```typescript
let API_URL = 'https://api.example.com'; // Should be const
var userConfig = { theme: 'dark' }; // Should be const
```

### Rationale
- Prevents accidental reassignment
- Makes code more predictable
- Helps with optimization
```

### In-Memory Rule Management
- **Rule Repository Class**: Central rule management with full memory indexing
- **Structural Parsing**: Parse all .md files into structured objects on startup
- **Semantic Indexing**: Build search indexes for content, categories, and relationships
- **Change Detection**: File system watchers for real-time updates

### Bidirectional File Conversion (핵심)
- **Markdown AST Preservation**: Store original markdown structure tree in memory
- **Format-Preserving Updates**: Maintain original formatting, spacing, and style
- **Selective Section Updates**: Update only changed sections, preserve rest
- **Template-Free Reconstruction**: Rebuild .md files from preserved structure, not templates
- **Diff-Based Writing**: Write only actual changes to minimize file disruption

### Duplicate Prevention & Merging
- **Content Similarity Detection**: Use semantic similarity to identify duplicate rules
- **Rule Conflict Resolution**: Intelligent merging of similar rules
- **Version Tracking**: Keep history of rule changes for rollback capabilities
- **Smart Updates**: Always update existing rules instead of creating duplicates

## 💾 Bidirectional Conversion Architecture

### Rule Object Structure in Memory
```typescript
interface RuleFile {
  // File metadata
  filepath: string;
  lastModified: Date;
  
  // YAML frontmatter (structured)
  metadata: {
    title: string;
    categories: string[];
    tags: string[];
    description?: string;
    version: string;
    lastModified: string;
    author?: string;
    relatedRules?: string[];
  };
  
  // Markdown content (preserving original structure)
  ast: MarkdownAST;  // Original markdown AST
  sections: RuleSection[];  // Parsed logical sections
  
  // Format preservation
  originalFormatting: {
    frontmatterStyle: 'yaml' | 'toml';
    indentation: string;
    lineEndings: '\n' | '\r\n';
    headerStyle: 'atx' | 'setext';
  };
}

interface RuleSection {
  id: string;  // Generated section ID
  level: number;  // Header level (1-6)
  title: string;
  content: string;
  startLine: number;  // Original line number
  endLine: number;
  subsections: RuleSection[];
}
```

### Parsing Strategy (.md → Memory)
1. **YAML Frontmatter Extraction**: Parse and validate frontmatter
2. **Markdown AST Generation**: Use remark/unified to create syntax tree
3. **Section Decomposition**: Break down into logical sections with IDs
4. **Format Analysis**: Detect and store formatting preferences
5. **Content Indexing**: Build search indexes from parsed content

### Reconstruction Strategy (Memory → .md)
1. **Selective Updates**: Identify which sections actually changed
2. **AST Modification**: Update only changed nodes in the AST
3. **Format Preservation**: Apply original formatting rules
4. **Atomic Writing**: Write to temp file, then atomic move/replace
5. **Validation**: Verify reconstructed file can be re-parsed

### Example Implementation Flow
```typescript
class RuleFileManager {
  async updateRuleSection(filepath: string, sectionId: string, newContent: string) {
    const ruleFile = this.repository.get(filepath);
    
    // 1. Find the section to update
    const section = this.findSection(ruleFile, sectionId);
    
    // 2. Update section content
    section.content = newContent;
    section.lastModified = new Date();
    
    // 3. Update AST nodes
    this.updateASTNode(ruleFile.ast, section);
    
    // 4. Regenerate .md file with preserved formatting
    const markdownContent = this.generateMarkdown(ruleFile);
    
    // 5. Atomic file write
    await this.atomicWrite(filepath, markdownContent);
    
    // 6. Update indexes
    this.updateIndexes(ruleFile);
  }
  
  private generateMarkdown(ruleFile: RuleFile): string {
    // Reconstruct from AST with original formatting
    return unified()
      .use(remarkStringify, {
        bullet: ruleFile.originalFormatting.listStyle,
        emphasis: ruleFile.originalFormatting.emphasisStyle,
        // ... preserve other formatting options
      })
      .stringify(ruleFile.ast);
  }
}
```

## 🔧 Technical Considerations

### File System Management
- Atomic operations for rule updates
- Backup creation before modifications
- Conflict resolution for concurrent edits
- Path validation and sanitization

### Performance Optimization
- Full rule repository cached in memory on startup
- Incremental updates for file changes
- Parallel processing for bulk operations
- Efficient search with pre-built indexes

### Bidirectional Conversion Reliability
- **Round-trip Testing**: Ensure .md → Memory → .md produces identical results
- **Format Preservation Validation**: Verify formatting, spacing, and style consistency
- **Backup and Rollback**: Automatic backup before any modification
- **Change Tracking**: Track what exactly changed for debugging and rollback

### Error Handling
- Comprehensive validation before operations
- Rollback capabilities for failed operations
- Clear error messages for debugging
- Graceful degradation for partial failures

### Security
- Input sanitization for all parameters
- Path traversal prevention
- Content validation for markdown safety
- Access control for sensitive rules

## 📝 Integration with Natural Language

### Command Interpretation
The MCP server should be able to interpret natural language requests like:
- "Add a rule about using async/await instead of promises"
- "Update the git commit rules to include ticket numbers"
- "Find all rules related to performance optimization"
- "Remove outdated jQuery rules"

### Response Formatting
- Clear success/failure messages
- Helpful suggestions for improvements
- Context-aware error messages
- Structured output for complex operations

## 🎯 Success Metrics

1. **Ease of Use**: AI can perform rule operations with minimal prompts
2. **Performance**: Operations complete within acceptable time limits
3. **Reliability**: Zero data loss during rule modifications
4. **Flexibility**: Support for various rule structures and formats
5. **Scalability**: Handle large rule repositories efficiently

## 🚀 Next Steps

1. Review this plan with the development team
2. Create detailed API specifications for each command
3. Implement Phase 1 commands
4. Test with AI agents using natural language prompts
5. Iterate based on feedback and usage patterns

---

## 🎯 Real-world Usage Scenario

### Example: AI Updates TypeScript Rule

**Original .md file** (`typescript-style-guide.md`):
```markdown
---
title: "TypeScript Style Guide"
categories: ["frontend", "typescript"]
tags: ["variables", "style"]
version: "1.0"
lastModified: "2024-01-15T10:30:00Z"
---

# TypeScript Style Guide

## Variable Declarations

### Use const for immutable values
Always use `const` for variables that don't change.

**Good:**
```typescript
const API_URL = 'https://api.example.com';
```

## Function Declarations

### Prefer arrow functions
Use arrow functions for better `this` binding.
```

**AI Request**: "Add a rule about using readonly for arrays that don't change"

**System Process**:
1. Parse existing file into memory structure
2. Identify "Variable Declarations" section
3. Add new subsection about readonly arrays
4. Update metadata (lastModified, version)
5. Reconstruct .md file preserving original formatting

**Updated .md file**:
```markdown
---
title: "TypeScript Style Guide"
categories: ["frontend", "typescript"]
tags: ["variables", "style", "readonly"]
version: "1.1"
lastModified: "2024-01-15T11:45:00Z"
---

# TypeScript Style Guide

## Variable Declarations

### Use const for immutable values
Always use `const` for variables that don't change.

**Good:**
```typescript
const API_URL = 'https://api.example.com';
```

### Use readonly for immutable arrays
Use `readonly` modifier for arrays that shouldn't be modified.

**Good:**
```typescript
const VALID_STATUSES: readonly string[] = ['active', 'inactive'];
```

**Bad:**
```typescript
const VALID_STATUSES: string[] = ['active', 'inactive']; // Can be modified
```

## Function Declarations

### Prefer arrow functions
Use arrow functions for better `this` binding.
```

**Key Benefits**:
- ✅ Original formatting preserved (spaces, line breaks, code block styles)
- ✅ Metadata automatically updated (tags, version, lastModified)
- ✅ Logical section insertion (new rule added in correct location)
- ✅ No manual file editing required - AI just describes what it wants

This plan ensures that AI agents can seamlessly manage rules through natural language, making the RuleBased MCP a powerful tool for AI-driven development workflows. 