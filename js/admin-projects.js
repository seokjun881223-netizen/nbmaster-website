(() => {
  const ADMIN_EMAIL = "nbmaster1223@naver.com";
  const BUCKET = "project-images";
  const labels = {
    excavation: "홈파기시공",
    heating: "난방시공",
    plumbing: "수도설비시공",
    leak: "누수탐지"
  };

  let editingId = null;
  let currentProjects = [];
  let existingImages = [];

  const $ = (selector) => document.querySelector(selector);
  const status = (message, type = "") => {
    const box = $("#projectFormStatus");
    box.textContent = message;
    box.className = `admin-form-status ${type}`.trim();
  };
  const safeFileName = (name) =>
    name.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-");


  const loadImageSource = async (file) => {
    if ("createImageBitmap" in window) {
      return createImageBitmap(file, { imageOrientation: "from-image" });
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`${file.name} 이미지를 읽지 못했습니다.`));
      };

      image.src = url;
    });
  };

  const optimizeImage = async (file) => {
    if (!file.type.startsWith("image/")) {
      throw new Error(`${file.name}은 이미지 파일이 아닙니다.`);
    }

    // 움직이는 GIF는 변환하면 애니메이션이 사라지므로 원본 유지
    if (file.type === "image/gif") {
      if (file.size > 15 * 1024 * 1024) {
        throw new Error(`${file.name} GIF 파일은 15MB를 초과합니다.`);
      }
      return file;
    }

    if (file.size > 30 * 1024 * 1024) {
      throw new Error(`${file.name}은 30MB를 초과합니다.`);
    }

    const source = await loadImageSource(file);
    const sourceWidth = source.width || source.naturalWidth;
    const sourceHeight = source.height || source.naturalHeight;
    const maxDimension = 1920;
    const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d", { alpha: false });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);

    if (typeof source.close === "function") {
      source.close();
    }

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => result ? resolve(result) : reject(new Error(`${file.name} 사진 최적화에 실패했습니다.`)),
        "image/webp",
        0.82
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, "") || "project-image";
    return new File(
      [blob],
      `${safeFileName(baseName)}.webp`,
      { type: "image/webp", lastModified: Date.now() }
    );
  };

  const ensureAdmin = async () => {
    const { data: { user }, error } = await window.nbSupabase.auth.getUser();
    if (error || !user || user.email !== ADMIN_EMAIL) {
      location.href = "admin-login.html";
      return null;
    }
    return user;
  };

  const fetchProjects = async () => {
    const { data, error } = await window.nbSupabase
      .from("projects")
      .select("id,category,title,summary,description,region,work_details,is_published,created_at,project_images(id,image_url,storage_path,sort_order)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    currentProjects = data || [];
    renderList();
  };

  const renderList = () => {
    const body = $("#projectTableBody");
    if (!currentProjects.length) {
      body.innerHTML = '<tr><td colspan="6">등록된 관리자 게시글이 없습니다.</td></tr>';
      return;
    }

    body.innerHTML = currentProjects.map((project) => `
      <tr>
        <td>${new Date(project.created_at).toLocaleDateString("ko-KR")}</td>
        <td>${labels[project.category] || project.category}</td>
        <td class="admin-project-title">${project.title}</td>
        <td>${(project.project_images || []).length}장</td>
        <td><span class="admin-publish-badge ${project.is_published ? "published" : "draft"}">${project.is_published ? "게시중" : "비공개"}</span></td>
        <td>
          <div class="admin-row-actions">
            <button type="button" data-edit="${project.id}">수정</button>
            <button type="button" class="danger" data-delete="${project.id}">삭제</button>
          </div>
        </td>
      </tr>`).join("");
  };

  const renderExistingImages = () => {
    const wrap = $("#existingProjectImages");
    if (!existingImages.length) {
      wrap.innerHTML = '<p class="admin-help">기존 사진이 없습니다.</p>';
      return;
    }

    wrap.innerHTML = existingImages
      .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
      .map((image, index) => `
        <label class="admin-existing-image">
          <img src="${image.image_url}" alt="기존 사진 ${index + 1}">
          <span>${index === 0 ? "현재 대표사진" : `${index + 1}번째 사진`}</span>
          <input type="checkbox" value="${image.id}" data-delete-image>
          <em>삭제 선택</em>
        </label>`).join("");
  };

  const resetForm = () => {
    editingId = null;
    existingImages = [];
    $("#projectForm").reset();
    $("#projectId").value = "";
    $("#projectFormTitle").textContent = "새 시공사례 등록";
    $("#projectSubmitButton").textContent = "게시글 등록";
    $("#projectCancelEdit").hidden = true;
    $("#existingImagesField").hidden = true;
    $("#selectedFileList").textContent = "선택된 새 사진이 없습니다.";
    renderExistingImages();
    status("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (id) => {
    const project = currentProjects.find((item) => item.id === id);
    if (!project) return;

    editingId = id;
    existingImages = [...(project.project_images || [])];
    $("#projectId").value = id;
    $("#category").value = project.category;
    $("#title").value = project.title;
    $("#summary").value = project.summary;
    $("#region").value = project.region;
    $("#workDetails").value = project.work_details;
    $("#description").value = project.description;
    $("#isPublished").checked = project.is_published;
    $("#projectImages").value = "";
    $("#projectFormTitle").textContent = "시공사례 수정";
    $("#projectSubmitButton").textContent = "수정 내용 저장";
    $("#projectCancelEdit").hidden = false;
    $("#existingImagesField").hidden = false;
    $("#selectedFileList").textContent = "새로 추가할 사진이 없습니다.";
    renderExistingImages();
    status("수정할 내용을 확인한 뒤 저장하세요.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadFiles = async (projectId, files, startOrder) => {
    const rows = [];
    const uploadedPaths = [];

    for (let index = 0; index < files.length; index += 1) {
      const originalFile = files[index];

      status(`사진 최적화 및 업로드 중 (${index + 1}/${files.length})...`);
      const file = await optimizeImage(originalFile);

      if (file.size > 15 * 1024 * 1024) {
        throw new Error(`${originalFile.name} 최적화 후에도 15MB를 초과합니다.`);
      }

      const path = `${projectId}/${Date.now()}-${index}-${safeFileName(file.name)}`;
      const { error: uploadError } = await window.nbSupabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
          contentType: file.type
        });
      if (uploadError) throw uploadError;

      uploadedPaths.push(path);
      const { data: publicData } = window.nbSupabase.storage.from(BUCKET).getPublicUrl(path);
      rows.push({
        project_id: projectId,
        image_url: publicData.publicUrl,
        storage_path: path,
        sort_order: startOrder + index
      });
    }

    if (rows.length) {
      const { error } = await window.nbSupabase.from("project_images").insert(rows);
      if (error) {
        await window.nbSupabase.storage.from(BUCKET).remove(uploadedPaths);
        throw error;
      }
    }
  };

  const normalizeImageOrder = async (projectId) => {
    const { data, error } = await window.nbSupabase
      .from("project_images")
      .select("id,sort_order")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    if (error) throw error;

    for (let index = 0; index < (data || []).length; index += 1) {
      if (data[index].sort_order !== index) {
        const { error: updateError } = await window.nbSupabase
          .from("project_images")
          .update({ sort_order: index })
          .eq("id", data[index].id);
        if (updateError) throw updateError;
      }
    }
  };

  const deleteSelectedImages = async () => {
    const selectedIds = [...document.querySelectorAll("[data-delete-image]:checked")]
      .map((input) => Number(input.value));
    if (!selectedIds.length) return;

    const selected = existingImages.filter((image) => selectedIds.includes(Number(image.id)));
    const paths = selected.map((image) => image.storage_path).filter((path) => path && !path.startsWith("legacy:"));
    if (paths.length) {
      const { error: storageError } = await window.nbSupabase.storage.from(BUCKET).remove(paths);
      if (storageError) throw storageError;
    }
    const { error } = await window.nbSupabase.from("project_images").delete().in("id", selectedIds);
    if (error) throw error;
  };

  const saveProject = async (event) => {
    event.preventDefault();
    const submit = $("#projectSubmitButton");
    submit.disabled = true;
    status(editingId ? "수정 내용을 저장하고 있습니다..." : "게시글과 사진을 등록하고 있습니다...");

    try {
      const files = [...$("#projectImages").files];
      const payload = {
        category: $("#category").value,
        title: $("#title").value.trim(),
        summary: $("#summary").value.trim(),
        region: $("#region").value.trim(),
        work_details: $("#workDetails").value.trim(),
        description: $("#description").value.trim(),
        is_published: $("#isPublished").checked,
        updated_at: new Date().toISOString()
      };

      if (!payload.title || !payload.summary) throw new Error("제목과 카드 설명은 필수입니다.");

      let projectId = editingId;

      if (editingId) {
        await deleteSelectedImages();
        const { error } = await window.nbSupabase.from("projects").update(payload).eq("id", editingId);
        if (error) throw error;

        const { count, error: countError } = await window.nbSupabase
          .from("project_images")
          .select("*", { count: "exact", head: true })
          .eq("project_id", editingId);
        if (countError) throw countError;
        await uploadFiles(editingId, files, count || 0);
        await normalizeImageOrder(editingId);
      } else {
        if (!files.length) throw new Error("게시글 사진을 한 장 이상 선택하세요.");

        const { data, error } = await window.nbSupabase
          .from("projects")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        projectId = data.id;

        try {
          await uploadFiles(projectId, files, 0);
        } catch (uploadError) {
          await window.nbSupabase.from("projects").delete().eq("id", projectId);
          throw uploadError;
        }
      }

      status(editingId ? "수정이 완료되었습니다." : "게시글이 등록되었습니다.", "success");
      await fetchProjects();
      setTimeout(resetForm, 800);
    } catch (error) {
      console.error(error);
      status(`저장 실패: ${error.message}`, "error");
    } finally {
      submit.disabled = false;
    }
  };

  const removeProject = async (id) => {
    const project = currentProjects.find((item) => item.id === id);
    if (!project) return;
    if (!confirm(`"${project.title}" 게시글을 삭제할까요?\n사진도 함께 삭제됩니다.`)) return;

    try {
      const paths = (project.project_images || []).map((image) => image.storage_path).filter((path) => path && !path.startsWith("legacy:"));
      if (paths.length) {
        const { error: storageError } = await window.nbSupabase.storage.from(BUCKET).remove(paths);
        if (storageError) throw storageError;
      }
      const { error } = await window.nbSupabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      if (editingId === id) resetForm();
      await fetchProjects();
    } catch (error) {
      alert(`삭제하지 못했습니다: ${error.message}`);
    }
  };

  const init = async () => {
    if (!window.nbSupabase) {
      alert("Supabase 설정 파일을 불러오지 못했습니다.");
      return;
    }
    if (!await ensureAdmin()) return;

    $("#projectForm").addEventListener("submit", saveProject);
    $("#projectCancelEdit").addEventListener("click", resetForm);
    $("#refreshProjects").addEventListener("click", fetchProjects);
    $("#adminLogout").addEventListener("click", async () => {
      await window.nbSupabase.auth.signOut();
      location.href = "admin-login.html";
    });
    $("#projectImages").addEventListener("change", (event) => {
      const files = [...event.target.files];
      $("#selectedFileList").textContent = files.length
        ? `${files.length}장 선택: ${files.map((file) => file.name).join(", ")}`
        : "선택된 새 사진이 없습니다.";
    });
    $("#projectTableBody").addEventListener("click", (event) => {
      const edit = event.target.closest("[data-edit]");
      const remove = event.target.closest("[data-delete]");
      if (edit) startEdit(edit.dataset.edit);
      if (remove) removeProject(remove.dataset.delete);
    });

    try {
      await fetchProjects();
    } catch (error) {
      status(`목록을 불러오지 못했습니다: ${error.message}`, "error");
    }
  };

  document.addEventListener("DOMContentLoaded", init);
})();
