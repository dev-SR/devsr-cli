import { intro, text, select, cancel, isCancel } from "@clack/prompts";
import fs from "fs-extra";
import path from "path";

function pascalCase(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export default async function dotnetSrcGen() {
    intro("🟦 .NET Service/Repo/Controller Generator");

    const entity = await text({ message: "Enter entity name (e.g., Product):" });
    if (isCancel(entity)) {
        cancel("Exiting...");
        process.exit(0);
    }
    const entityName = pascalCase(entity as string);

    const basePath = await text({
        message: "Base module path (default=src/Modules)",
        placeholder: "src/Modules"
    });
    if (isCancel(basePath)) {
        cancel("Exiting...");
        process.exit(0);
    }

    const targetDir = path.resolve(process.cwd(), basePath || "src/Modules", entityName);
    await fs.ensureDir(targetDir);

    // Service file
    const servicePath = path.join(targetDir, `${entityName}Service.cs`);
    const repoPath = path.join(targetDir, `${entityName}Repository.cs`);
    const controllerPath = path.join(targetDir, `${entityName}Controller.cs`);

    const namespace = `${entityName}Module`;

    const serviceCode = `
namespace ${namespace}.Services;

public class ${entityName}Service
{
    private readonly ${entityName}Repository _repo;

    public ${entityName}Service(${entityName}Repository repo)
    {
        _repo = repo;
    }

    public IEnumerable<${entityName}> GetAll() => _repo.GetAll();
}
`;

    const repoCode = `
namespace ${namespace}.Repositories;

public class ${entityName}Repository
{
    public IEnumerable<${entityName}> GetAll()
    {
        return new List<${entityName}>(); // TODO: Replace with DB logic
    }
}

public class ${entityName}
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
`;

    const controllerCode = `
using Microsoft.AspNetCore.Mvc;
using ${namespace}.Services;

namespace ${namespace}.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ${entityName}Controller : ControllerBase
{
    private readonly ${entityName}Service _service;

    public ${entityName}Controller(${entityName}Service service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_service.GetAll());
    }
}
`;

    try {
        await fs.writeFile(servicePath, serviceCode.trimStart(), "utf8");
        await fs.writeFile(repoPath, repoCode.trimStart(), "utf8");
        await fs.writeFile(controllerPath, controllerCode.trimStart(), "utf8");

        console.log(`✅ Generated Service, Repository, Controller under: ${targetDir}`);
    } catch (err) {
        console.error("❌ Failed to generate source files:", err);
        process.exit(1);
    }
}
